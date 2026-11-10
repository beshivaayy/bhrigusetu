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
