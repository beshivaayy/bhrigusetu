import asyncio
from datetime import date, time

import pytest
from pydantic import ValidationError

from app.astronomy import jhora_provider
from app.astronomy.jhora_provider import JHoraChartRequest, _request_payload


def test_jhora_payload_preserves_selected_settings_and_local_utc_offset():
    request = JHoraChartRequest(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40, 0),
        latitude=22.1765,
        longitude=75.5805,
        timezone="Asia/Kolkata",
        place_name="Maheshwar, Madhya Pradesh, India",
        ayanamsa_mode="TRUE_LAHIRI",
        node_type="true",
        calculation_type="drik",
        bhava_madhya_method=3,
        timezone_mode="file",
    )

    payload = _request_payload(request)

    assert payload["date"] == "2000-01-01"
    assert payload["time"] == "09:40:00"
    assert payload["timezone"] == 5.5
    assert payload["ayanamsa_mode"] == "TRUE_LAHIRI"
    assert payload["node_type"] == "true"
    assert payload["bhava_madhya_method"] == 3
    assert payload["timezone_mode"] == "file"
    assert "ayanamsa_value" not in payload


def test_custom_ayanamsha_requires_value():
    with pytest.raises(ValidationError):
        JHoraChartRequest(
            date_of_birth=date(2000, 1, 1),
            time_of_birth=time(9, 40),
            latitude=22.1765,
            longitude=75.5805,
            ayanamsa_mode="SIDM_USER",
        )


def test_custom_ayanamsha_value_only_allowed_for_custom_mode():
    with pytest.raises(ValidationError):
        JHoraChartRequest(
            date_of_birth=date(2000, 1, 1),
            time_of_birth=time(9, 40),
            latitude=22.1765,
            longitude=75.5805,
            ayanamsa_mode="LAHIRI",
            ayanamsa_value=24.0,
        )


def test_custom_ayanamsha_is_sent_only_with_custom_mode():
    request = JHoraChartRequest(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40),
        latitude=22.1765,
        longitude=75.5805,
        ayanamsa_mode="SIDM_USER",
        ayanamsa_value=24.125,
    )
    assert _request_payload(request)["ayanamsa_value"] == 24.125


def test_unsupported_node_and_bhava_options_are_rejected():
    base = {
        "date_of_birth": date(2000, 1, 1),
        "time_of_birth": time(9, 40),
        "latitude": 22.1765,
        "longitude": 75.5805,
    }
    with pytest.raises(ValidationError):
        JHoraChartRequest(**base, node_type="apparent")
    with pytest.raises(ValidationError):
        JHoraChartRequest(**base, bhava_madhya_method=6)


def test_successful_jhora_response_is_cached_for_same_inputs(monkeypatch):
    calls = []

    class FakeResponse:
        status_code = 200
        is_success = True
        text = ""

        def json(self):
            return {
                "birth_details": {
                    "request_settings": {"ayanamsa_mode": "LAHIRI", "node_type": "mean"},
                    "timezone_used": 5.5,
                    "timezone_source": "request",
                },
                "horoscope": {"ayanamsa_value": 23.7, "divisional_charts": {"D-1_rasi": {}}},
                "engine_revision": 21,
            }

    class FakeClient:
        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, traceback):
            return False

        async def post(self, url, json):
            calls.append({"url": url, "payload": json})
            return FakeResponse()

    jhora_provider._clear_jhora_cache()
    monkeypatch.setattr(jhora_provider.httpx, "AsyncClient", FakeClient)
    request = JHoraChartRequest(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40),
        latitude=22.1765,
        longitude=75.5805,
        timezone="Asia/Kolkata",
    )

    first = asyncio.run(jhora_provider.calculate_with_jhora(request))
    second = asyncio.run(jhora_provider.calculate_with_jhora(request))

    assert first["cache"]["hit"] is False
    assert second["cache"]["hit"] is True
    assert second["engine_revision"] == 21
    assert len(calls) == 1
    jhora_provider._clear_jhora_cache()


def test_jhora_cache_separates_calculation_settings(monkeypatch):
    calls = []

    class FakeResponse:
        status_code = 200
        is_success = True
        text = ""

        def json(self):
            return {
                "birth_details": {"request_settings": {}, "timezone_used": 5.5},
                "horoscope": {"divisional_charts": {}},
                "engine_revision": 21,
            }

    class FakeClient:
        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, traceback):
            return False

        async def post(self, url, json):
            calls.append(json)
            return FakeResponse()

    jhora_provider._clear_jhora_cache()
    monkeypatch.setattr(jhora_provider.httpx, "AsyncClient", FakeClient)
    request = JHoraChartRequest(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40),
        latitude=22.1765,
        longitude=75.5805,
        timezone="Asia/Kolkata",
    )
    true_node_request = request.model_copy(update={"node_type": "true"})

    asyncio.run(jhora_provider.calculate_with_jhora(request))
    result = asyncio.run(jhora_provider.calculate_with_jhora(true_node_request))

    assert result["cache"]["hit"] is False
    assert len(calls) == 2
    assert calls[0]["node_type"] == "mean"
    assert calls[1]["node_type"] == "true"
    jhora_provider._clear_jhora_cache()


def test_jhora_timezone_mode_defaults_to_automatic_historical_lookup():
    request = JHoraChartRequest(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40),
        latitude=22.1765,
        longitude=75.5805,
    )
    assert request.timezone_mode == "auto"
    assert _request_payload(request)["timezone_mode"] == "auto"
