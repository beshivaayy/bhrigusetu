# Astronomy engine and licensing decision record

## Requirements

The chart layer needs reproducible geocentric ecliptic longitudes for the Sun, Moon, Mercury, Venus, Mars, Jupiter and Saturn; a clearly defined lunar-node convention; a sidereal ascendant; and a documented house/sign mapping. Every result must retain the UTC instant, IANA timezone, coordinates, ephemeris/provider version, ayanamsha definition and calculation flags.

## Swiss Ephemeris: do not integrate before choosing a licence

Astro.com documents a dual-licensing model for Swiss Ephemeris: AGPL or a paid professional licence. The choice must be made before distributing software containing it or activating a public service. Under the AGPL option, the complete application must be AGPL or compatible. See:

- https://www.astro.com/swisseph/swephinfo_p.htm
- https://github.com/astrorigin/pyswisseph

BhriguSetu is a public repository and may become a hosted service. Therefore, adding `pyswisseph` casually would create a material licensing decision. It is intentionally not in requirements.txt.

## Alternatives under evaluation

- PyMeeus: documented astronomical algorithms based on Jean Meeus, LGPLv3, with planetary and lunar routines. It avoids Swiss Ephemeris's dual-licence decision, but its outputs still require comparison against independent reference charts before production use. Documentation: https://pymeeus.readthedocs.io/
- Skyfield + JPL DE ephemerides: a strong astronomy-oriented option; ephemeris file distribution, runtime download, coverage and deployment footprint need to be specified. Documentation: https://rhodesmill.org/skyfield/

## Working chart conventions — not yet certified

The project has previously specified Lahiri/Chitrapaksha and whole-sign houses as intended defaults. These are configuration choices, not universal truths of every BCP/BSP school. The exact Lahiri definition (including mean/true frame, epoch constant and precession model), node type (mean/true), apparent/geometric position convention, and ayanamsa reference implementation must be frozen before chart output is labelled validated.

Astro.com's documentation distinguishes Lahiri definitions and gives the IAE 1985 reference value; do not collapse all variants under a single undocumented "Lahiri" label:
https://www.astro.com/swisseph/swisseph.htm

## Release gate

Do not enable chart-derived BCP/BSP predictions until:
1. The dependency and licence are approved.
2. The exact ephemeris, time scale, ayanamsha and node conventions are recorded.
3. A source-controlled golden test set compares the implementation with independently generated reference charts over multiple eras and latitudes.
4. Ascendant and house boundaries are tested, including high latitudes and DST transitions.
5. The UI shows the calculation settings and a reproducibility receipt.


## Initial implementation selected (2026-11-17)

The first chart engine uses Astronomy Engine 2.1.19 (astronomy-engine on PyPI), an MIT-licensed library. It provides geocentric vectors in the J2000 equatorial frame and a documented transform to the true ecliptic of date. The implementation deliberately uses GeoVector + Ecliptic for planets; EclipticLongitude is heliocentric and is therefore not suitable for natal geocentric longitudes.

- Project: https://github.com/cosinekitty/astronomy
- Python package/API reference: https://pypi.org/project/astronomy-engine/
- Published accuracy statement: approximately ±1 arcminute for supported celestial positions.
- Version pinned in backend/requirements.txt: astronomy-engine==2.1.19.

The current chart implementation calculates Sun through Saturn, mean lunar node (Rahu) and opposite Ketu, tropical ascendant converted to sidereal, whole-sign houses, nakshatra/pada, and D1/D9 mapping. Planetary motion is estimated from a centred 24-hour longitude difference.

Ayanamsha caveat: the current Lahiri/Chitrapaksha value is a polynomial approximation anchored at J2000. It is not represented as the complete Swiss Ephemeris IAE 1985 implementation. Chart metadata explicitly labels it approximate. The implementation has been checked against a known Lahiri reference chart for the 2000 epoch, but a broader golden set across dates and latitudes remains a release gate.

Node caveat: mean node only; true node is not implemented.

Do not enable BSP predictions from this chart output yet. The chart engine is a deterministic astronomy/mapping layer; the five BSP candidates remain disabled pending primary-source verification and independent worked examples.
