import pytest
from datetime import date, time

from app.astronomy.ephemeris import (
    _sign_data,
    calculate_natal_chart,
    lahiri_ayanamsha_approx,
)
from app.models import BirthDetails


def test_lahiri_polynomial_has_documented_j2000_anchor():
    assert lahiri_ayanamsha_approx(2451545.0) == pytest.approx(23.8570922, abs=1e-6)


def test_nakshatra_pada_and_navamsa_sign_boundaries():
    zero = _sign_data(0.0)
    assert zero["sign"] == "Aries"
    assert zero["nakshatra"] == "Ashwini"
    assert zero["pada"] == 1
    assert zero["navamsa"]["sign"] == "Aries"

    taurus = _sign_data(30.0)
    assert taurus["sign"] == "Taurus"
    assert taurus["navamsa"]["sign"] == "Capricorn"


def test_chart_returns_classical_grahas_houses_and_divisional_charts():
    birth = BirthDetails(
        date_of_birth=date(1987, 8, 23),
        time_of_birth=time(12, 0),
        latitude=28.6139,
        longitude=77.2090,
        timezone="Asia/Kolkata",
    )
    chart = calculate_natal_chart(birth)

    assert chart["status"] == "calculated_with_approximate_lahiri_model"
    assert set(chart["planets"]) == {
        "Sun", "Moon", "Mercury", "Venus", "Mars",
        "Jupiter", "Saturn", "Rahu", "Ketu",
    }
    assert len(chart["houses"]) == 12
    assert chart["house_system"] == "whole_sign"
    assert chart["observer"]["timezone"] == "Asia/Kolkata"
    assert chart["ephemeris"]["provider_version"] == "2.1.19"
    assert chart["divisional_charts"]["D1"]["lagna"] == chart["lagna"]
    assert chart["divisional_charts"]["D9"]["lagna"]["sign"]
    assert chart["ephemeris"]["node"].startswith("mean lunar node")

    rahu = chart["planets"]["Rahu"]["longitude"]
    ketu = chart["planets"]["Ketu"]["longitude"]
    assert (ketu - rahu) % 360 == pytest.approx(180.0, abs=1e-7)

    for name, planet in chart["planets"].items():
        assert 1 <= planet["whole_sign_house"] <= 12
        assert planet["sign"]
        assert planet["nakshatra"]
        assert 1 <= planet["pada"] <= 4
        if name not in {"Rahu", "Ketu"}:
            assert planet["motion"] in {"direct", "retrograde"}
            assert "daily_motion_deg" in planet
