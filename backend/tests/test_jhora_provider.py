from datetime import date, time

import pytest
from pydantic import ValidationError

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
