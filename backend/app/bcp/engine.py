"""BCP date/house activation layer.

This implements the project's documented running-year and 12-house rotation
convention. Chakra-swami labels remain provisional pending primary citations.
No astrological predictions are generated here.
"""
from __future__ import annotations
from datetime import date

CHAKRA_SWAMIS = {
    1: "Moon", 2: "Mercury", 3: "Venus", 4: "Sun", 5: "Mars",
    6: "Jupiter", 7: "Saturn", 8: "Rahu", 9: "Ketu",
}

def _anniversary_in_year(dob: date, year: int) -> date:
    """Use March 1 for a Feb 29 birthday in a non-leap year."""
    try:
        return dob.replace(year=year)
    except ValueError:
        return date(year, 3, 1)

def calculate_running_year(dob: date, on_date: date) -> int:
    """Return completed calendar years + 1, using the local calendar date."""
    if on_date < dob:
        raise ValueError("The analysis date cannot be before the date of birth.")
    completed = on_date.year - dob.year
    if on_date < _anniversary_in_year(dob, on_date.year):
        completed -= 1
    return completed + 1

def analyze_bcp(running_year: int) -> dict:
    """Calculate documented 12-house activation and provisional cycle label."""
    if running_year < 1:
        raise ValueError("running_year must be a positive integer.")
    cycle = ((running_year - 1) // 12) + 1
    activated_house = ((running_year - 1) % 12) + 1
    chakra_swami = CHAKRA_SWAMIS.get(cycle)
    return {
        "status": "calculated_provisional",
        "running_year": running_year,
        "activated_house": activated_house,
        "cycle": cycle,
        "chakra_swami": chakra_swami,
        "chakra_swami_status": "pending_primary_source_verification" if chakra_swami else "not_defined_in_current_sequence",
        "formula": {
            "activated_house": "((running_year - 1) % 12) + 1",
            "cycle": "((running_year - 1) // 12) + 1",
        },
        "interpretation_status": "not_enabled_pending_rule_verification",
        "message": "House activation is calculated; predictive interpretation remains disabled pending source verification.",
    }
