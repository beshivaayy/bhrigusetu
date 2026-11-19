# Manual chart-position import

BhriguSetu maps sidereal longitudes supplied by an external chart calculator. This is **not** an ephemeris engine: the caller is responsible for the source chart, birth data, time conversion, ayanamsha and node convention.

## Contract

POST /api/chart/manual with:

~~~json
{
  "running_year": 27,
  "lagna_longitude": 285.5,
  "ayanamsha": "Lahiri",
  "planetary_longitudes": {
    "Sun": 245.2, "Moon": 195.4, "Mars": 303.8,
    "Mercury": 250.1, "Jupiter": 1.4, "Venus": 217.3,
    "Saturn": 16.5, "Rahu": 101.2, "Ketu": 281.2
  }
}
~~~

Longitudes are caller-declared sidereal degrees in [0, 360). The optional ayanamsha field is a descriptive label only (default unspecified); BhriguSetu does not verify the source chart's ayanamsha, zodiac frame, node convention or calculation settings. Supported keys: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu and Ketu. Any subset is accepted. The endpoint maps each supplied position to a sign, degree within sign and whole-sign house relative to Lagna. Missing positions are not inferred.

An ayanamsha name such as Lahiri is a **caller-declared label**, not a verified calculation setting. Whole-sign mapping is deterministic; planetary positions are not checked against an ephemeris.

## BCP cycle-ruler reference

For cycles 1–9 only, if the relevant cycle ruler is supplied, the API exposes the parallel year-counting reference described in M. Imran's published secondary extension: https://saptarishisastrology.com/bhrigu-chakra-with-cycle-rulers-by-m-imran/. The article frames the sequence as an effort to expand Bhrigu Chakra; it is not verified as core/original BCP. The API status is `provisional_secondary_source_only`; this mapping is not used to generate predictions. Cycle 10+ is unavailable rather than wrapped.

## BSP safeguards

All five BSP candidates remain disabled. Manual chart mapping does not evaluate predictive rules and returns no event claims.

## MCP

Use analyze_supplied_chart_tool with the same running year, Lagna longitude and planetary-longitude mapping. HTTP and MCP share one calculation function.
