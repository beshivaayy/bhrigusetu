"""Client for the public Jagannatha Hora REST API.

This is a separate provider from the in-repository approximate Astronomy Engine.
It does not claim parity with the desktop JHora application.
"""
from __future__ import annotations

import copy
import hashlib
import json
import os
from collections import OrderedDict
from threading import RLock
from time import monotonic
from typing import Literal

import httpx
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models import BirthDetails


AYANAMSHA_MODES = (
    "LAHIRI", "TRUE_CITRA", "TRUE_LAHIRI", "KP", "FAGAN", "RAMAN",
    "USHASHASHI", "YUKTESHWAR", "SURYASIDDHANTA",
    "SURYASIDDHANTA_MSUN", "ARYABHATA", "ARYABHATA_MSUN", "SS_CITRA",
    "TRUE_REVATI", "SS_REVATI", "TRUE_PUSHYA", "TRUE_MULA",
    "KP-SENTHIL", "SENTHIL", "SIDM_USER",
)


class JHoraChartRequest(BirthDetails):
    """Birth data plus explicitly selectable settings supported by POST /horoscope."""

    model_config = ConfigDict(extra="forbid")

    ayanamsa_mode: Literal[
        "LAHIRI", "TRUE_CITRA", "TRUE_LAHIRI", "KP", "FAGAN", "RAMAN",
        "USHASHASHI", "YUKTESHWAR", "SURYASIDDHANTA",
        "SURYASIDDHANTA_MSUN", "ARYABHATA", "ARYABHATA_MSUN", "SS_CITRA",
        "TRUE_REVATI", "SS_REVATI", "TRUE_PUSHYA", "TRUE_MULA",
        "KP-SENTHIL", "SENTHIL", "SIDM_USER",
    ] = "LAHIRI"
    ayanamsa_value: float | None = Field(default=None, ge=-30, le=30)
    node_type: Literal["mean", "true"] = "mean"
    calculation_type: Literal["drik", "ss"] = "drik"
    bhava_madhya_method: Literal[1, 2, 3, 4, 5] = 5
    timezone_mode: Literal["auto", "file"] = "auto"
    language: Literal["en", "hi", "ka", "ta", "te"] = "en"

    @model_validator(mode="after")
    def validate_custom_ayanamsha(self):
        if self.ayanamsa_mode == "SIDM_USER" and self.ayanamsa_value is None:
            raise ValueError("ayanamsa_value is required when ayanamsa_mode is SIDM_USER")
        if self.ayanamsa_mode != "SIDM_USER" and self.ayanamsa_value is not None:
            raise ValueError("ayanamsa_value is only valid with ayanamsa_mode SIDM_USER")
        return self


def _request_payload(request: JHoraChartRequest) -> dict:
    local_birth = request.resolved_birth_datetime()
    offset = local_birth.utcoffset()
    if offset is None:
        raise ValueError("Birth datetime must resolve to a UTC offset")
    payload = {
        "date": request.date_of_birth.isoformat(),
        "time": request.time_of_birth.isoformat(timespec="seconds"),
        "place": request.place_name or "",
        "latitude": request.latitude,
        "longitude": request.longitude,
        "timezone": offset.total_seconds() / 3600,
        "elevation": 0,
        "ayanamsa_mode": request.ayanamsa_mode,
        "node_type": request.node_type,
        "calculation_type": request.calculation_type,
        "bhava_madhya_method": request.bhava_madhya_method,
        "timezone_mode": request.timezone_mode,
        "language": request.language,
    }
    if request.ayanamsa_mode == "SIDM_USER":
        payload["ayanamsa_value"] = request.ayanamsa_value
    return payload


# Process-local cache: bounded, short-lived, and never written to disk.
_CACHE_TTL_SECONDS = 300
_CACHE_MAX_ENTRIES = 128
_JHORA_CACHE: OrderedDict[str, tuple[float, dict]] = OrderedDict()
_JHORA_CACHE_REVISION_BY_FINGERPRINT: dict[str, str] = {}
_JHORA_CACHE_LOCK = RLock()


def _cache_fingerprint(payload: dict, base_url: str) -> str:
    normalized = json.dumps(
        {"provider": base_url, "payload": payload},
        sort_keys=True,
        separators=(",", ":"),
    )
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def _cache_entry_key(fingerprint: str, engine_revision: str) -> str:
    return hashlib.sha256(
        f"{fingerprint}:{engine_revision}".encode("utf-8")
    ).hexdigest()


def _get_cached_result(fingerprint: str) -> dict | None:
    now = monotonic()
    with _JHORA_CACHE_LOCK:
        revision = _JHORA_CACHE_REVISION_BY_FINGERPRINT.get(fingerprint)
        if revision is None:
            return None
        key = _cache_entry_key(fingerprint, revision)
        entry = _JHORA_CACHE.get(key)
        if entry is None:
            _JHORA_CACHE_REVISION_BY_FINGERPRINT.pop(fingerprint, None)
            return None
        expires_at, cached_result = entry
        if expires_at <= now:
            _JHORA_CACHE.pop(key, None)
            _JHORA_CACHE_REVISION_BY_FINGERPRINT.pop(fingerprint, None)
            return None
        _JHORA_CACHE.move_to_end(key)
        response = copy.deepcopy(cached_result)
        response["cache"] = {
            "hit": True,
            "ttl_seconds": _CACHE_TTL_SECONDS,
            "expires_in_seconds": max(0, int(expires_at - now)),
        }
        return response


def _store_cached_result(
    fingerprint: str,
    engine_revision: object,
    response: dict,
) -> None:
    if engine_revision is None:
        return
    revision = str(engine_revision)
    key = _cache_entry_key(fingerprint, revision)
    now = monotonic()
    with _JHORA_CACHE_LOCK:
        for expired_key, (expires_at, _) in list(_JHORA_CACHE.items()):
            if expires_at <= now:
                _JHORA_CACHE.pop(expired_key, None)
                for known_fingerprint, known_revision in list(
                    _JHORA_CACHE_REVISION_BY_FINGERPRINT.items()
                ):
                    if _cache_entry_key(known_fingerprint, known_revision) == expired_key:
                        _JHORA_CACHE_REVISION_BY_FINGERPRINT.pop(known_fingerprint, None)
        _JHORA_CACHE[key] = (now + _CACHE_TTL_SECONDS, copy.deepcopy(response))
        _JHORA_CACHE.move_to_end(key)
        _JHORA_CACHE_REVISION_BY_FINGERPRINT[fingerprint] = revision
        while len(_JHORA_CACHE) > _CACHE_MAX_ENTRIES:
            evicted_key, _ = _JHORA_CACHE.popitem(last=False)
            for known_fingerprint, known_revision in list(
                _JHORA_CACHE_REVISION_BY_FINGERPRINT.items()
            ):
                if _cache_entry_key(known_fingerprint, known_revision) == evicted_key:
                    _JHORA_CACHE_REVISION_BY_FINGERPRINT.pop(known_fingerprint, None)


def _clear_jhora_cache() -> None:
    """Clear process-local cache state; used by tests and maintenance."""
    with _JHORA_CACHE_LOCK:
        _JHORA_CACHE.clear()
        _JHORA_CACHE_REVISION_BY_FINGERPRINT.clear()


async def calculate_with_jhora(request: JHoraChartRequest) -> dict:
    """Call the published REST endpoint; never silently fall back to local math."""
    base_url = os.getenv(
        "JHORA_API_BASE_URL",
        "https://jagannatha-hora-359167915530.europe-west1.run.app",
    ).rstrip("/")
    timeout = httpx.Timeout(connect=5.0, read=45.0, write=10.0, pool=5.0)
    payload = _request_payload(request)
    fingerprint = _cache_fingerprint(payload, base_url)
    cached = _get_cached_result(fingerprint)
    if cached is not None:
        return cached
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(f"{base_url}/horoscope", json=payload)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Jagannatha Hora API timed out; no fallback was applied.")
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Jagannatha Hora API is unavailable; no fallback was applied.")

    if response.status_code == 422:
        raise HTTPException(status_code=422, detail={"provider": "Jagannatha Hora public API", "message": "Provider rejected the requested birth data or calculation settings.", "provider_detail": response.text[:2000]})
    if response.status_code == 429:
        raise HTTPException(status_code=429, detail="Jagannatha Hora API rate limit reached; retry later. No fallback was applied.")
    if response.status_code >= 500:
        raise HTTPException(status_code=503, detail="Jagannatha Hora API returned a server error; no fallback was applied.")
    if not response.is_success:
        raise HTTPException(status_code=502, detail=f"Jagannatha Hora API returned HTTP {response.status_code}.")

    try:
        result = response.json()
    except ValueError:
        raise HTTPException(status_code=502, detail="Jagannatha Hora API returned invalid JSON.")

    horoscope = result.get("horoscope", {}) if isinstance(result, dict) else {}
    birth_details = result.get("birth_details", {}) if isinstance(result, dict) else {}
    output = {
        "status": "calculated_by_external_provider",
        "provider": "Jagannatha Hora public REST API",
        "provider_base_url": base_url,
        "desktop_jhora_parity": "not_established",
        "requested_settings": {
            "ayanamsa_mode": request.ayanamsa_mode,
            "ayanamsa_value": request.ayanamsa_value,
            "node_type": request.node_type,
            "calculation_type": request.calculation_type,
            "bhava_madhya_method": request.bhava_madhya_method,
            "timezone_mode": request.timezone_mode,
            "language": request.language,
        },
        "applied_settings": birth_details.get("request_settings"),
        "request_notes": horoscope.get("request_notes"),
        "timezone_used": birth_details.get("timezone_used"),
        "timezone_source": birth_details.get("timezone_source"),
        "ayanamsa_value": horoscope.get("ayanamsa_value"),
        "engine_revision": result.get("engine_revision"),
        "result": result,
        "warnings": [
            "This result comes from the independent Jagannatha Hora public REST API, not the desktop application.",
            "Desktop-JHora parity has not been established by BhriguSetu reference-chart tests.",
        ],
    }
    output["cache"] = {
        "hit": False,
        "ttl_seconds": _CACHE_TTL_SECONDS,
    }
    _store_cached_result(fingerprint, result.get("engine_revision"), output)
    return output
