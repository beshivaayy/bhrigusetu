# JHora REST Provider Contract

**Status:** verified against the public API reference on 2026-11-17. This document records the published request contract; it does not claim that BhriguSetu has integrated the provider or passed desktop-JHora parity tests.

## Provider identity and attribution

- Provider: **Jagannatha Hora public REST API**.
- Base URL: `https://jagannatha-hora-359167915530.europe-west1.run.app`.
- Main chart endpoint: `POST /horoscope`.
- OpenAPI specification: https://jagannathahora.com/docs/openapi.json
- API documentation: https://jagannathahora.com/api-mcp
- Published usage terms require credit to Jagannatha Hora and caching of results.
- The provider states that it is independent and is not affiliated with any desktop astrology software or its author. BhriguSetu must call it the **Jagannatha Hora public API**, not the official desktop JHora application.
- The public API states that request bodies are not stored by the service; hosting request logs retain standard metadata for 30 days. BhriguSetu must still disclose its own processing and avoid logging birth details.

## Request contract: `POST /horoscope`

Required fields:

| Field | Type | BhriguSetu mapping |
| --- | --- | --- |
| `date` | string, YYYY-MM-DD | `BirthDetails.date_of_birth` |
| `time` | string, HH:MM:SS | `BirthDetails.time_of_birth` |
| `place` | string | `BirthDetails.place_name` or empty string |
| `latitude` | number | `BirthDetails.latitude` |
| `longitude` | number | `BirthDetails.longitude` |
| `timezone` | number, UTC offset hours | Offset from resolved local birth datetime, not a hard-coded India offset |

Optional fields include `elevation` (default 0), `gender` (male/female), `ayanamsa_mode`, `ayanamsa_value`, `calculation_type`, `node_type`, `bhava_madhya_method`, `timezone_mode`, `language`, `pravesha_type`, `years`, `months`, `sixty_hours`, `divisional_chart_factor`, `chart_method`, `base_rasi`, `count_from_end_of_sign`, `varnada_method`, `tamil_month_method`, and `kali_start_year`.

### Ayanamsha modes documented for `/horoscope`

`LAHIRI`, `TRUE_CITRA`, `TRUE_LAHIRI`, `KP`, `FAGAN`, `RAMAN`, `USHASHASHI`, `YUKTESHWAR`, `SURYASIDDHANTA`, `SURYASIDDHANTA_MSUN`, `ARYABHATA`, `ARYABHATA_MSUN`, `SS_CITRA`, `TRUE_REVATI`, `SS_REVATI`, `TRUE_PUSHYA`, `TRUE_MULA`, `KP-SENTHIL`, `SENTHIL`, and `SIDM_USER`.

For `SIDM_USER`, `ayanamsa_value` is mandatory (range -30 to +30 degrees). Do not display a custom-offset control unless the value is validated and passed with this mode.

### Node and calculation settings

| API field | Documented values | Required UI behaviour |
| --- | --- | --- |
| `node_type` | `mean`, `true` | Expose Mean / True Node selector. Send the selected value explicitly. |
| `calculation_type` | `drik`, `ss` | Expose Drik / Surya Siddhanta only where the selected workflow supports it. |
| `bhava_madhya_method` | 1 equal houses (Lagna mid-house), 2 equal houses (Lagna start), 3 Sripati, 4 KP/Placidus, 5 Whole Sign | Keep Bhava Chalit method separate from Rasi sign placement. |
| `timezone_mode` | `auto`, `file` | Default to `auto`; preserve the provider-reported offset and source. |
| `language` | `en`, `hi`, `ka`, `ta`, `te` | Display-only; never treat as a calculation setting. |
| `chart_method` | 1–6, chart-dependent | Do not offer unsupported chart-method combinations. Provider docs say unavailable methods can fall back to 1 and report a note; BhriguSetu must surface that note. |

## Provider capability matrix

| Capability | Published REST contract | Integration status in BhriguSetu |
| --- | --- | --- |
| Ayanamsha modes above | Supported by `/horoscope` | Not integrated |
| Custom ayanamsha | `SIDM_USER` + `ayanamsa_value` | Not integrated |
| Mean / True lunar node | `node_type` | Not integrated |
| Drik / Surya Siddhanta | `calculation_type` | Not integrated |
| Bhava methods 1–5 | `bhava_madhya_method` | Not integrated |
| Historical timezone resolution | `timezone_mode`; response reports applied offset | Not integrated |
| D1 and divisional charts | Full response documents 23 vargas | Not integrated |
| Engine revision | `engine_revision` in response | Not integrated; must be stored in cache metadata |
| Rate limits | `/horoscope`: 30 requests/minute/IP | Not integrated; client must handle HTTP 429 |

**Important distinction:** the currently connected assistant-side JHora horoscope tool has a narrower input schema (birth details and optional gender; no explicit ayanamsha, node or bhava arguments). Do not assume that its tool interface exposes every REST setting. The REST contract above is the source for the planned BhriguSetu provider adapter.

## Integration requirements

1. Keep the existing in-repository Astronomy Engine calculation as an explicitly labelled **approximate fallback**, not the default authoritative result once the provider is configured.
2. Add a provider adapter with a strict request model. Validate every enum and numeric range before sending.
3. Resolve the IANA birth timezone to the actual offset at the birth instant. Do not pass `5.5` for every Indian birth regardless of historical date or DST elsewhere.
4. Send the full request body over HTTPS. Never put birth date/time or coordinates in query strings.
5. Set finite connect/read timeouts. Treat 422 as invalid/unsupported input, 429 as rate limiting, 5xx/network errors as provider unavailable. Never silently retry with different calculation settings.
6. Preserve the exact requested settings and provider-returned `request_settings`, `request_notes`, `timezone_used`, `timezone_source`, `ayanamsa_value`, and `engine_revision` in the calculation receipt where present.
7. Cache by normalized birth input + every calculation setting + provider identity + `engine_revision`. Never reuse a chart across different node, ayanamsha, bhava, timezone or chart-method settings.
8. Return a capability receipt with `provider`, `engine_revision`, requested settings, applied settings and warnings.
9. Surface provider fallbacks in `request_notes`; do not report a requested chart method as applied if the provider fell back to method 1.
10. Credit Jagannatha Hora in the UI and documentation. Make no uptime, support or desktop-application affiliation claims.

## Failure and fallback policy

- If a user explicitly selects the JHora API provider and it fails, return a clear provider error. Do not silently switch to the approximate engine.
- If the user explicitly selects the approximate in-repo engine, keep its limitations visible (approximate Lahiri polynomial, Mean Node only, Whole Sign only).
- If a setting is not supported by a provider/endpoint, disable it with the reason or reject the request. Never substitute a default without telling the user.
- Keep the calculation provider independent from interpretation-source priority. Sunil John, Deepanshu Giri and Sanjay Rath remain the preferred interpretation/research sources; they are not ephemeris providers.

## Validation gate before claiming parity

The public API's own statement that its output matches its web application is not proof of parity with the desktop JHora application. For desktop parity, collect authorized desktop reference exports with identical birth input and settings, then compare:

- all nine graha longitudes and Lagna in arcseconds;
- ayanamsha value and mode;
- Mean/True node convention and Ketu opposition;
- nakshatra/pada and D1/D9 plus other requested varga placements;
- Rasi placements and Bhava Chalit assignments separately;
- timezone offset actually applied and provider engine revision.

Report per-point angular error, maximum/median error, boundary mismatches and exact settings. Until those fixtures pass, describe the result as **Jagannatha Hora public API output**, not desktop-JHora parity.

## References

- API and endpoint contract: https://jagannathahora.com/api-mcp
- OpenAPI 3.1 document: https://jagannathahora.com/docs/openapi.json
- MCP usage guide: https://jagannathahora.com/api-mcp/mcp-usage
