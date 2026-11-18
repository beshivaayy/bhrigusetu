# Jagannatha Hora Public REST Provider — Capability Matrix

**Last live contract check:** 2026-11-19  
**Endpoint:** `POST https://jagannatha-hora-359167915530.europe-west1.run.app/horoscope`  
**OpenAPI:** `https://jagannatha-hora-359167915530.europe-west1.run.app/openapi.json`  
**Provider documentation:** `https://jagannathahora.com/api-mcp`

## Provenance and accuracy boundary

BhriguSetu calls the independently operated Jagannatha Hora public REST API. The provider documentation explicitly distinguishes it from the desktop astrology application and its author. It must be labelled **Jagannatha Hora public REST API**, not the official desktop JHora engine.

Desktop-JHora parity is **not established**. No user-supplied/exported desktop reference-chart fixture set has yet been checked in. Existing unit tests prove request construction, input validation, caching and application invariants; they do not prove astronomical accuracy.

## Live request contract

The live OpenAPI 3.1 document lists these required `POST /horoscope` fields:

| Field | Provider contract | BhriguSetu handling |
| --- | --- | --- |
| `date` | YYYY-MM-DD; documented years 1800–2100 | Sent from `date_of_birth`; provider range is now validated |
| `time` | HH:MM:SS local civil time | Sent from local wall time |
| `place` | Required string; echoed, coordinates determine calculation | Sends supplied place or the explicit label `Manual coordinates` |
| `latitude` | Decimal degrees | Sent from birth coordinates |
| `longitude` | Decimal degrees, east positive | Sent from birth coordinates |
| `timezone` | Numeric UTC offset in hours | Derived from the resolved IANA timezone at birth; fallback for provider auto mode |

The provider documentation says locations beyond approximately 66.5° north or south are rejected. The OpenAPI response schema for HTTP 200 is currently an empty object schema, so the response payload is not fully machine-described in OpenAPI. The adapter therefore retains the raw response and labels the provider and engine revision.

## Calculation settings

| Setting | Live provider capability | BhriguSetu status |
| --- | --- | --- |
| Ayanamsha | LAHIRI, TRUE_CITRA, TRUE_LAHIRI, KP, FAGAN, RAMAN, USHASHASHI, YUKTESHWAR, SURYASIDDHANTA, SURYASIDDHANTA_MSUN, ARYABHATA, ARYABHATA_MSUN, SS_CITRA, TRUE_REVATI, SS_REVATI, TRUE_PUSHYA, TRUE_MULA, KP-SENTHIL, SENTHIL, SIDM_USER | **Exposed**; custom value required only for SIDM_USER |
| Lunar node | mean / true | **Exposed** |
| Calculation tradition | drik / ss (Surya Siddhanta) | **Exposed** |
| Bhava method | 1 equal (Lagna middle); 2 equal (Lagna start); 3 Sripati; 4 KP/Placidus; 5 Whole Sign | **Exposed**; BhriguSetu defaults to 5 explicitly, not provider default 1 |
| Historical timezone | auto / file | **Exposed** |
| Output language | en / hi / ka / ta / te | **Exposed** |
| Gender-conditioned yogas | Optional male / female; provider omits those yogas when unspecified | **Exposed as optional input**; no gender is inferred |
| Elevation | Optional metres, default 0 | Not exposed; provider default applies |
| Pravesha type | 0 natal, 1 annual, 2 tithi-pravesha | Not exposed; provider default 0 applies |
| Dasha scope | Query parameter: all / vimsottari | Not exposed; provider default applies |
| Varga range | Provider documentation describes 23 divisional charts, D-1 through D-144 | Documented by provider; actual returned keys and placement conventions still need captured fixtures |
| Zodiac selector | No explicit tropical/sidereal selector in this endpoint contract; ayanamsha settings indicate sidereal output | Not selectable; do not claim tropical support |
| Geocentric / topocentric | No explicit observer-mode field documented for this endpoint | Not selectable / not verified |
| Apparent / mean planetary positions | No explicit selector documented for this endpoint | Not selectable / not verified |
| Desktop JHora engine selection | Not offered as a separate request option | Not available; parity remains unproven |

The public documentation lists a per-IP rate limit of 30 requests/minute for `/horoscope`. BhriguSetu caches identical requests briefly and separates cache entries by every supplied calculation setting.

## Important implementation notes

- The provider's `timezone_mode=auto` derives the historical timezone offset from coordinates and date, using the supplied numeric offset only as a fallback. `file` uses the supplied offset verbatim.
- BhriguSetu resolves the local wall time using an IANA timezone first, including DST ambiguity/fold handling, then sends the resulting numeric offset.
- The API's custom ayanamsha mode is `SIDM_USER`; it requires `ayanamsa_value` in degrees.
- Mean and true nodes are provider-supported. This does not mean the in-repository Astronomy Engine has true-node support; that engine remains mean-node only.
- Bhava Madhya is separate from Rasi sign placement. The selected Bhava method applies to the provider's bhava chart; do not relabel the Rasi chart as a Bhava Chalit chart.
- The API response includes `engine_revision`; retain it in the calculation receipt and invalidate stale cached results when the cache TTL expires.
- No silent fallback to the approximate in-repository chart engine is permitted when the external provider fails.

## Outstanding validation work

1. Obtain a small, authorized set of desktop JHora exported reference charts, with their exact settings.
2. Store the original inputs, provider request settings, desktop output provenance and date/version in source-controlled fixtures; do not invent reference outputs.
3. Compare each graha and Lagna longitude in arcseconds, plus sign, nakshatra/pada, D1/D9 and all available varga placements.
4. Record median/max error and every sign, nakshatra or Navamsa boundary disagreement.
5. Test multiple eras, latitude bands, DST transitions and the provider's high-latitude rejection boundary.
6. Capture representative raw provider responses and document the actual varga keys/structures; OpenAPI currently does not define the 200 response body.
7. Keep the release statement at **external provider integrated; desktop parity unverified** until the fixture suite is complete.

## Sources

- Live OpenAPI 3.1: https://jagannatha-hora-359167915530.europe-west1.run.app/openapi.json
- Public REST endpoint reference and capability descriptions: https://jagannathahora.com/api-mcp
- Provider MCP guide: https://jagannathahora.com/api-mcp/mcp-usage
