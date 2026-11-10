# BhriguSetu Architecture

    Birth Details
        -> Next.js UI
        -> FastAPI validation
        -> Local-time / running-year service
        -> BCP activation engine
        -> BSP rule catalog and evaluator
        -> Source trace
        -> UI

## Boundaries
- The frontend collects and displays data; it is never the calculation source of truth.
- Birth date, local wall time, coordinates and IANA timezone are validated by the API.\n- Nonexistent DST wall times are rejected; repeated DST wall times require an explicit fold choice.\n- Resolved local and UTC birth instants are returned as a reproducibility receipt.\n- The `tzdata` dependency supplies IANA timezone data on Windows hosts.
- Running-year calculation uses the date in the submitted timezone, not the server timezone.
- BCP house activation is currently a documented arithmetic layer, not a complete predictive interpretation.
- BSP rules are loaded from backend/app/rules/bsp_rules.json. A rule must have source evidence and a validation case before it can be enabled.
- Astronomical chart calculation is not implemented. Do not display fabricated planetary positions, ascendant or houses.

## Configuration
- Backend CORS origins: comma-separated CORS_ORIGINS.
- Frontend API base URL: NEXT_PUBLIC_API_BASE_URL.
- Local development defaults to http://localhost:8000.

## Astronomy dependency gate

No ephemeris package is installed yet. Swiss Ephemeris requires an explicit AGPL-versus-professional licensing decision before public deployment. See research/ASTRONOMY_AND_LICENSING.md. Do not silently substitute a different ayanamsha, node convention or house system.
