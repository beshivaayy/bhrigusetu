"""Deterministic mapping for externally supplied sidereal longitudes; no ephemeris."""
from __future__ import annotations
from math import isfinite
from pydantic import BaseModel, ConfigDict, Field, field_validator
from ..bcp.engine import CHAKRA_SWAMIS, analyze_bcp
from ..bsp.engine import analyze_bsp

SIGNS = ("Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces")
PLANETS = frozenset({"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"})
CYCLE_SOURCE = "M. Imran, Bhrigu Chakra with Cycle Rulers (published secondary extension; not verified as core BCP): https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/"


class SuppliedChartInput(BaseModel):
    """Positions supplied by an external chart calculator."""
    model_config = ConfigDict(extra="forbid")
    running_year: int = Field(ge=1)
    lagna_longitude: float = Field(ge=0, lt=360)
    ayanamsha: str = Field(default="unspecified", min_length=1, max_length=80)
    planetary_longitudes: dict[str, float] = Field(default_factory=dict)

    @field_validator("lagna_longitude")
    @classmethod
    def finite_lagna(cls, value: float) -> float:
        if not isfinite(value):
            raise ValueError("lagna_longitude must be finite")
        return value

    @field_validator("ayanamsha")
    @classmethod
    def normalize_ayanamsha(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("ayanamsha must be a non-empty label or unspecified")
        return value

    @field_validator("planetary_longitudes")
    @classmethod
    def validate_planetary_longitudes(cls, values: dict[str, float]) -> dict[str, float]:
        normalized: dict[str, float] = {}
        for raw_name, longitude in values.items():
            name = raw_name.strip().title()
            if name not in PLANETS:
                raise ValueError(f"Unsupported planet: {raw_name}")
            if name in normalized:
                raise ValueError(f"Duplicate planet after normalization: {name}")
            if not isfinite(longitude) or not 0 <= longitude < 360:
                raise ValueError(f"{name} longitude must be finite and in [0, 360)")
            normalized[name] = longitude
        return normalized


def _position(longitude: float, lagna_sign_index: int) -> dict:
    sign_index = int(longitude // 30)
    return {"longitude": longitude, "sign": SIGNS[sign_index], "sign_index": sign_index,
            "degree_in_sign": longitude - sign_index * 30,
            "whole_sign_house": (sign_index - lagna_sign_index) % 12 + 1}


def analyze_supplied_chart(chart: SuppliedChartInput) -> dict:
    """Map caller-supplied sidereal positions to signs and whole-sign houses."""
    lagna_sign_index = int(chart.lagna_longitude // 30)
    lagna = _position(chart.lagna_longitude, lagna_sign_index)
    lagna["whole_sign_house"] = 1
    planets = {name: _position(value, lagna_sign_index) for name, value in sorted(chart.planetary_longitudes.items())}
    cycle = ((chart.running_year - 1) // 12) + 1
    swami = CHAKRA_SWAMIS.get(cycle)
    reference = {"status": "unavailable_cycle_outside_secondary_sequence", "cycle": cycle,
                 "chakra_swami": swami, "source": CYCLE_SOURCE,
                 "note": "M. Imran's nine-cycle ruler sequence is a published secondary extension, not verified as core BCP; cycle 10+ is not inferred."}
    if swami:
        reference["status"] = "cycle_lord_position_not_supplied"
        if swami in planets:
            lord_sign = planets[swami]["sign_index"]
            year_in_cycle = (chart.running_year - 1) % 12 + 1
            target_sign = (lord_sign + year_in_cycle - 1) % 12
            reference.update({"status": "provisional_secondary_source_only",
                "reference_house_from_cycle_lord": year_in_cycle,
                "reference_sign": SIGNS[target_sign], "reference_sign_index": target_sign,
                "corresponding_lagna_house": (target_sign - lagna_sign_index) % 12 + 1})
    bcp = analyze_bcp(chart.running_year)
    bcp["cycle_ruler_reference"] = reference
    bcp["cycle_ruler_reference_status"] = reference["status"]
    if reference["status"] == "provisional_secondary_source_only":
        bcp["reference_basis"] = "natal_lagna_plus_provisional_cycle_lord"
        bcp["cycle_ruler_reference_note"] = (
            "Mapped from caller-supplied positions using M. Imran's published secondary extension; "
            "not verified as core BCP and remains provisional."
        )
    elif reference["status"] == "cycle_lord_position_not_supplied":
        bcp["cycle_ruler_reference_note"] = "The provisional cycle lord's natal position was not supplied."
    else:
        bcp["cycle_ruler_reference_note"] = "No cycle-lord mapping is defined beyond the nine-cycle secondary-source sequence."
    bsp = analyze_bsp(chart.running_year)

    return {
        "status": "manual_positions_mapped",
        "position_source": "caller_supplied; no ephemeris calculation performed",
        "zodiac": "sidereal (caller-declared)",
         "ayanamsha": (
            f"{chart.ayanamsha} (caller-declared; not independently verified)"
            if chart.ayanamsha.lower() != "unspecified"
            else "unspecified (not declared by caller; not verified)"
        ),
        "house_system": "whole_sign", "running_year": chart.running_year,
        "lagna": lagna, "planets": planets, "bcp": bcp,
        "bcp_cycle_reference": reference, "bsp": bsp,
        "warnings": [
            "Planetary longitudes and Lagna are caller-supplied; BhriguSetu did not calculate an ephemeris.",
            (
                f"{chart.ayanamsha} is caller-declared and not independently verified."
                if chart.ayanamsha.lower() != "unspecified"
                else "Ayanamsha was not specified by the caller; no sidereal frame can be verified."
            ),
            "Whole-sign houses only map the supplied positions.",
            "BCP cycle-ruler reference follows M. Imran's published secondary extension; it is not verified as core BCP and remains provisional.",
            "No BSP production rules or event predictions are enabled."
        ]
    }
