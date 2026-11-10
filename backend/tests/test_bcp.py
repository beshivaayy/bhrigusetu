from datetime import date
import pytest
from app.bcp.engine import analyze_bcp, calculate_running_year

def test_running_year_before_and_on_birthday():
    assert calculate_running_year(date(2000, 1, 1), date(2025, 12, 31)) == 26
    assert calculate_running_year(date(2000, 1, 1), date(2026, 1, 1)) == 27

def test_running_year_after_birthday():
    assert calculate_running_year(date(2000, 6, 15), date(2026, 6, 14)) == 26
    assert calculate_running_year(date(2000, 6, 15), date(2026, 6, 15)) == 27

def test_running_year_rejects_date_before_birth():
    with pytest.raises(ValueError):
        calculate_running_year(date(2000, 1, 2), date(2000, 1, 1))

def test_february_29_anniversary_is_march_1_in_non_leap_year():
    assert calculate_running_year(date(2000, 2, 29), date(2025, 2, 28)) == 25
    assert calculate_running_year(date(2000, 2, 29), date(2025, 3, 1)) == 26

@pytest.mark.parametrize(
    ("running_year", "house", "cycle"),
    [(1, 1, 1), (12, 12, 1), (13, 1, 2), (24, 12, 2), (25, 1, 3), (27, 3, 3), (108, 12, 9)],
)
def test_bcp_house_and_cycle_rotation(running_year, house, cycle):
    result = analyze_bcp(running_year)
    assert result["activated_house"] == house
    assert result["cycle"] == cycle

def test_chakra_swami_sequence_is_marked_provisional():
    result = analyze_bcp(25)
    assert result["chakra_swami"] == "Venus"
    assert result["chakra_swami_status"] == "pending_primary_source_verification"

def test_cycle_beyond_documented_sequence_does_not_wrap():
    result = analyze_bcp(109)
    assert result["cycle"] == 10
    assert result["chakra_swami"] is None

def test_running_year_must_be_positive():
    with pytest.raises(ValueError):
        analyze_bcp(0)

def test_bcp_reference_point_is_explicitly_lagna_only():
    result = analyze_bcp(27)
    assert result["reference_basis"] == "natal_lagna_only"
    assert result["cycle_ruler_reference_status"] == "not_calculated_chart_data_required"
