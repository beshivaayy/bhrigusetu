"""Single-query OSM Nominatim geocoding with policy-aware caching and throttling."""
from __future__ import annotations

import asyncio
import time
from typing import Any

import httpx
from timezonefinder import timezone_at_land

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "BhriguSetu/0.3 (+https://github.com/beshivaayy/bhrigusetu)"
MIN_REQUEST_INTERVAL_SECONDS = 1.1
CACHE_TTL_SECONDS = 30 * 24 * 60 * 60

_cache: dict[str, tuple[float, list[dict[str, Any]]]] = {}
_request_lock = asyncio.Lock()
_last_request_at = 0.0

def _normalise_query(query: str) -> str:
    return " ".join(query.strip().split())

async def search_places(query: str) -> list[dict[str, Any]]:
    """Search once on explicit user request; this is not an autocomplete API."""
    global _last_request_at
    normalised = _normalise_query(query)
    if len(normalised) < 3:
        raise ValueError("Enter at least 3 characters to search for a birthplace.")

    now = time.monotonic()
    cached = _cache.get(normalised.casefold())
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return cached[1]

    async with _request_lock:
        now = time.monotonic()
        cached = _cache.get(normalised.casefold())
        if cached and now - cached[0] < CACHE_TTL_SECONDS:
            return cached[1]

        wait = MIN_REQUEST_INTERVAL_SECONDS - (now - _last_request_at)
        if wait > 0:
            await asyncio.sleep(wait)

        # Reserve the global per-process request slot before network I/O.
        _last_request_at = time.monotonic()
        async with httpx.AsyncClient(
            timeout=10.0,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "application/json",
                "Accept-Language": "en",
            },
        ) as client:
            response = await client.get(
                NOMINATIM_URL,
                params={
                    "q": normalised,
                    "format": "jsonv2",
                    "addressdetails": 1,
                    "limit": 5,
                },
            )
            response.raise_for_status()
            raw_results = response.json()

        results: list[dict[str, Any]] = []
        for item in raw_results:
            try:
                latitude = float(item["lat"])
                longitude = float(item["lon"])
                place_id = int(item["place_id"])
            except (KeyError, TypeError, ValueError):
                continue
            results.append({
                "place_id": place_id,
                "display_name": str(item.get("display_name") or "Unnamed location"),
                "latitude": latitude,
                "longitude": longitude,
                "timezone": timezone_at_land(lng=longitude, lat=latitude),
                "osm_type": item.get("osm_type"),
                "osm_id": item.get("osm_id"),
            })

        _cache[normalised.casefold()] = (time.monotonic(), results)
        # Bound memory use while retaining a month of recent searches.
        if len(_cache) > 1000:
            cutoff = time.monotonic() - CACHE_TTL_SECONDS
            for key in list(_cache):
                if _cache[key][0] < cutoff:
                    _cache.pop(key, None)
        return results
