import pytest
from datetime import date, time

from app.astronomy.ephemeris import (
    NAKSHATRAS,
    NAKSHATRA_SPAN,
    PADA_SPAN,
    SIGNS,
    _sign_data,
    calculate_natal_chart,
)
from app.models import BirthDetails


def test_all_108_navamsa_segments_follow_classical_sign_sequence():
    for sign_index in range(12):
        modality = sign_index % 3
        start = sign_index if modality == 0 else (sign_index + (8 if modality == 1 else 4)) % 12
        for segment in range(9):
            longitude = sign_index * 30 + segment * (30 / 9) + 0.001
            result = _sign_data(longitude)
            assert result["sign_index"] == sign_index
            assert result["navamsa"]["sign_index"] == (start + segment) % 12
            assert result["navamsa"]["segment"] == segment + 1
            assert 0 <= result["navamsa"]["degree_in_sign"] < 30


def test_nakshatra_and_pada_boundaries_are_half_open():
    for index in range(27):
        start = index * NAKSHATRA_SPAN
        assert _sign_data(start)["nakshatra"] == NAKSHATRAS[index]
        assert _sign_data(start)["pada"] == 1
        for pada in range(1, 5):
            boundary = start + (pada - 1) * PADA_SPAN
            assert _sign_data(boundary)["pada"] == pada


def test_chart_longitudes_houses_and_d9_are_internally_consistent():
    birth = BirthDetails(
        date_of_birth=date(2000, 1, 1),
        time_of_birth=time(9, 40),
        latitude=22.1767,
        longitude=75.5800,
        timezone="Asia/Kolkata",
    )
    chart = calculate_natal_chart(birth)
    lagna_sign = chart["lagna"]["sign_index"]
    d9_lagna = chart["divisional_charts"]["D9"]["lagna"]["sign_index"]

    assert set(chart["planets"]) == {
        "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"
    }
    assert len(chart["houses"]) == 12
    for name, planet in chart["planets"].items():
        assert 0 <= planet["longitude"] < 360
        assert planet["sign_index"] == int(planet["longitude"] // 30)
        assert planet["whole_sign_house"] == (planet["sign_index"] - lagna_sign) % 12 + 1
        d9 = chart["divisional_charts"]["D9"]["planets"][name]
        assert d9["whole_sign_house"] == (d9["sign_index"] - d9_lagna) % 12 + 1
    assert (chart["planets"]["Ketu"]["longitude"] - chart["planets"]["Rahu"]["longitude"]) % 360 == pytest.approx(180)
    assert all(house["house"] == index for index, house in enumerate(chart["houses"], 1))
    assert all(house["sign_index"] == (lagna_sign + house["house"] - 1) % 12 for house in chart["houses"])



