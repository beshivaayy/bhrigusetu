"""Birth-chart astronomy using Astronomy Engine (MIT).

Coordinates are apparent geocentric ecliptic-of-date longitudes. The Lahiri
sidereal offset is an explicit polynomial approximation, not Swiss Ephemeris'
full IAE/ICRC implementation. See chart metadata and warnings.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from math import asin, atan2, cos, degrees, radians, sin

import astronomy

SIGNS = (
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
)
NAKSHATRAS = (
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati",
)
NAKSHATRA_SPAN = 360.0 / 27.0
PADA_SPAN = NAKSHATRA_SPAN / 4.0
NAVAMSA_SPAN = 30.0 / 9.0

BODY_MAP = {
    "Sun": None,
    "Moon": astronomy.Body.Moon,
    "Mercury": astronomy.Body.Mercury,
    "Venus": astronomy.Body.Venus,
    "Mars": astronomy.Body.Mars,
    "Jupiter": astronomy.Body.Jupiter,
    "Saturn": astronomy.Body.Saturn,
}


def _norm(value: float) -> float:
    return value % 360.0


def _geocentric_ecliptic_longitude(body, time) -> float:
    vector = astronomy.GeoVector(body, time, True)
    return astronomy.Ecliptic(vector).elon


def _julian_day(dt: datetime) -> float:
    return 2440587.5 + dt.timestamp() / 86400.0


def lahiri_ayanamsha_approx(julian_day: float) -> float:
    """J2000 Lahiri reference + IAU-style precession polynomial (approximate)."""
    centuries = (julian_day - 2451545.0) / 36525.0
    base = 23.0 + 51.0 / 60.0 + 25.532 / 3600.0
    precession_arcsec = 5028.796195 * centuries + 1.1054348 * centuries**2
    return base + precession_arcsec / 3600.0


def _obliquity_deg(julian_day: float) -> float:
    t = (julian_day - 2451545.0) / 36525.0
    arcsec = 21.448 - 46.8150 * t - 0.00059 * t**2 + 0.001813 * t**3
    return 23.0 + 26.0 / 60.0 + arcsec / 3600.0


def _altitude_sine(ecliptic_lon: float, latitude: float, lst_deg: float, obliq: float) -> float:
    lam, eps, phi = radians(ecliptic_lon), radians(obliq), radians(latitude)
    ra = atan2(sin(lam) * cos(eps), cos(lam))
    dec = asin(max(-1.0, min(1.0, sin(lam) * sin(eps))))
    hour_angle = radians((lst_deg - degrees(ra) + 180.0) % 360.0 - 180.0)
    return sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(hour_angle)


def _ascendant_tropical(julian_day: float, latitude: float, longitude: float) -> float:
    """Find the eastern ecliptic/horizon intersection by a bounded root search."""
    # Astronomy Engine Time stores UT days relative to J2000.
    time = astronomy.Time(julian_day - 2451545.0)
    lst = (_norm(astronomy.SiderealTime(time) * 15.0 + longitude))
    eps = _obliquity_deg(julian_day)

    roots: list[float] = []
    previous_lon = 0.0
    previous_alt = _altitude_sine(previous_lon, latitude, lst, eps)
    for step in range(1, 361):
        current_lon = float(step)
        current_alt = _altitude_sine(current_lon, latitude, lst, eps)
        if previous_alt == 0.0 or previous_alt * current_alt < 0.0:
            lo, hi = previous_lon, current_lon
            lo_value = previous_alt
            for _ in range(45):
                mid = (lo + hi) / 2.0
                mid_value = _altitude_sine(mid, latitude, lst, eps)
                if lo_value * mid_value <= 0:
                    hi = mid
                else:
                    lo, lo_value = mid, mid_value
            root = _norm((lo + hi) / 2.0)
            lam = radians(root)
            ra = degrees(atan2(sin(lam) * cos(radians(eps)), cos(lam)))
            hour_angle = (lst - ra + 180.0) % 360.0 - 180.0
            if hour_angle < 0:
                roots.append(root)
        previous_lon, previous_alt = current_lon, current_alt

    if not roots:
        raise ValueError("Could not resolve the eastern ascendant at this latitude/time.")
    return roots[0]


def _sign_data(longitude: float) -> dict:
    value = _norm(longitude)
    index = int(value // 30.0)
    degree = value - index * 30.0
    # Tiny tolerance prevents binary-float underflow at exact nakshatra/pada boundaries.
    boundary_epsilon = 1e-10
    nak_index = min(26, int((value + boundary_epsilon) // NAKSHATRA_SPAN))
    pada = min(
        4,
        int((value - nak_index * NAKSHATRA_SPAN + boundary_epsilon) // PADA_SPAN) + 1,
    )
    nak_index = min(26, int(value // NAKSHATRA_SPAN))
    pada = min(4, int((value - nak_index * NAKSHATRA_SPAN) // PADA_SPAN) + 1)

    segment = min(8, int(degree // NAVAMSA_SPAN))
    modality = index % 3
    if modality == 0:       # movable: starts from the same sign
        nav_start = index
    elif modality == 1:     # fixed: starts from the 9th sign
        nav_start = (index + 8) % 12
    else:                   # dual: starts from the 5th sign
        nav_start = (index + 4) % 12
    nav_index = (nav_start + segment) % 12
    nav_degree = (degree - segment * NAVAMSA_SPAN) * 9.0

    return {
        "longitude": round(value, 8),
        "sign": SIGNS[index],
        "sign_index": index,
        "degree_in_sign": round(degree, 8),
        "nakshatra": NAKSHATRAS[nak_index],
        "nakshatra_index": nak_index,
        "pada": pada,
        "navamsa": {
            "sign": SIGNS[nav_index],
            "sign_index": nav_index,
            "degree_in_sign": round(nav_degree, 8),
            "segment": segment + 1,
        },
    }


def _mean_node(julian_day: float) -> float:
    t = (julian_day - 2451545.0) / 36525.0
    return _norm(
        125.0445479
        - 1934.1362891 * t
        + 0.0020754 * t**2
        + t**3 / 467441.0
        - t**4 / 60616000.0
    )


def calculate_natal_chart(birth) -> dict:
    """Calculate a Lahiri-approximate D1/D9 chart from validated BirthDetails."""
    local_birth = birth.resolved_birth_datetime()
    utc_birth = local_birth.astimezone(timezone.utc)
    utc_iso = utc_birth.isoformat().replace("+00:00", "Z")
    astro_time = astronomy.Time.Parse(utc_iso)
    jd = _julian_day(utc_birth)
    ayanamsha = lahiri_ayanamsha_approx(jd)

    tropical: dict[str, float] = {}
    for name, body in BODY_MAP.items():
        tropical[name] = (
            astronomy.SunPosition(astro_time).elon
            if body is None
            else _geocentric_ecliptic_longitude(body, astro_time)
        )

    rahu = _mean_node(jd)
    tropical["Rahu"] = rahu
    tropical["Ketu"] = _norm(rahu + 180.0)

    sidereal = {name: _norm(value - ayanamsha) for name, value in tropical.items()}
    asc_tropical = _ascendant_tropical(jd, birth.latitude, birth.longitude)
    asc_sidereal = _norm(asc_tropical - ayanamsha)
    lagna_sign = int(asc_sidereal // 30.0)

    planets: dict[str, dict] = {}
    for name, longitude in sidereal.items():
        position = _sign_data(longitude)
        position["whole_sign_house"] = (position["sign_index"] - lagna_sign) % 12 + 1
        if name not in ("Rahu", "Ketu"):
            before = astronomy.Time.Parse(
                (utc_birth.replace(microsecond=0) - timedelta(hours=12))
                .isoformat().replace("+00:00", "Z")
            )
            after = astronomy.Time.Parse(
                (utc_birth.replace(microsecond=0) + timedelta(hours=12))
                .isoformat().replace("+00:00", "Z")
            )
            body = BODY_MAP[name]
            before_lon = astronomy.SunPosition(before).elon if body is None else _geocentric_ecliptic_longitude(body, before)
            after_lon = astronomy.SunPosition(after).elon if body is None else _geocentric_ecliptic_longitude(body, after)
            delta = (after_lon - before_lon + 180.0) % 360.0 - 180.0
            position["motion"] = "retrograde" if delta < 0 else "direct"
            position["daily_motion_deg"] = round(delta, 6)
        else:
            position["motion"] = "mean_node"
        planets[name] = position

    lagna = _sign_data(asc_sidereal)
    lagna["whole_sign_house"] = 1
    houses = []
    for house in range(1, 13):
        sign_index = (lagna_sign + house - 1) % 12
        occupants = sorted(
            name for name, pos in planets.items() if pos["whole_sign_house"] == house
        )
        houses.append({
            "house": house,
            "sign": SIGNS[sign_index],
            "sign_index": sign_index,
            "planets": occupants,
        })

    return {
        "status": "calculated_with_approximate_lahiri_model",
        "birth_datetime_local": local_birth.isoformat(),
        "birth_datetime_utc": utc_birth.isoformat(),
        "observer": {
            "latitude": birth.latitude,
            "longitude": birth.longitude,
            "timezone": birth.timezone,
        },
        "julian_day_ut": round(jd, 8),
        "zodiac": "sidereal",
        "ayanamsha": {
            "name": "Lahiri (Chitrapaksha)",
            "value_degrees": round(ayanamsha, 8),
            "model": "J2000 reference + IAU-style precession polynomial; approximate",
        },
        "ephemeris": {
            "provider": "Astronomy Engine",
            "provider_version": "2.1.19",
            "accuracy_claim": "approximately Â±1 arcminute for supported celestial positions",
            "accuracy_claim": "approximately ±1 arcminute for supported celestial positions",
            "coordinate_frame": "apparent geocentric ecliptic of date",
            "node": "mean lunar node; Ketu exactly opposite Rahu",
        },
        "house_system": "whole_sign",
        "lagna": lagna,
        "planets": planets,
        "houses": houses,
        "divisional_charts": {
            "D1": {"lagna": lagna, "planets": planets},
            "D9": {
                "lagna": lagna["navamsa"],
                "planets": {
                    name: position["navamsa"] | {
                        "whole_sign_house": (
                            position["navamsa"]["sign_index"] - lagna["navamsa"]["sign_index"]
                        ) % 12 + 1
                    }
                    for name, position in planets.items()
                },
            },
        },
        "warnings": [
            "This is an initial astronomy implementation, not a Swiss Ephemeris/Jagannatha Hora parity claim.",
            "Lahiri ayanamsha uses an explicit polynomial approximation and must be checked against Indian Astronomical Ephemeris reference values before precision-sensitive use.",
            "Mean lunar node is used; true node is not implemented.",
            "Whole-sign houses only; quadrant house systems are not implemented.",
            "Planetary longitudes inherit Astronomy Engine's approximately one-arcminute accuracy envelope.",
        ],
    }
