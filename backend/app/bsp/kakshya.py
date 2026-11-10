"""BSP-7 Kakshya slot lookup for a degree within a zodiac sign.

This is a deterministic lookup utility only. It does not independently
activate a BSP prediction or infer a chart placement.
"""
from __future__ import annotations
import math

KAKSHYA_WIDTH = 3.75
KAKSHYA_LORDS = (
    "Saturn",
    "Jupiter",
    "Mars",
    "Sun",
    "Venus",
    "Mercury",
    "Moon",
    "Ascendant",
)

def calculate_kakshya(degree_in_sign: float) -> dict:
    """Return the inclusive-start/exclusive-end 3°45′ Kakshya slot."""
    if not isinstance(degree_in_sign, (int, float)) or isinstance(degree_in_sign, bool):
        raise TypeError("degree_in_sign must be a number.")
    if not math.isfinite(degree_in_sign) or not 0 <= degree_in_sign < 30:
        raise ValueError("degree_in_sign must be in the range 0 <= degree < 30.")
    index = min(int(degree_in_sign / KAKSHYA_WIDTH), 7)
    start = index * KAKSHYA_WIDTH
    end = start + KAKSHYA_WIDTH
    return {
        "index": index + 1,
        "lord": KAKSHYA_LORDS[index],
        "start_degree": start,
        "end_degree": end,
        "boundary_policy": "start_inclusive_end_exclusive",
        "status": "source_transcribed_lookup",
    }


def same_degree_number(first_degree: float, second_degree: float) -> bool:
    """Compare whole degrees within two signs, as illustrated in BSP-7.

    The BSP-7 example treats Mars at 27°14′ and Venus at 27°50′ as the
    same degree. Therefore this helper compares integer degree numbers,
    not exact decimal longitudes. It does not calculate house placement.
    """
    for value in (first_degree, second_degree):
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise TypeError("degree values must be numeric.")
        if not math.isfinite(value) or not 0 <= value < 30:
            raise ValueError("degree values must be in the range 0 <= degree < 30.")
    return int(first_degree) == int(second_degree)
