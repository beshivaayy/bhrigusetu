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
- Birth date, time, coordinates and IANA timezone are validated by the API.
- Running-year calculation uses the date in the submitted timezone, not the server timezone.
- BCP house activation is currently a documented arithmetic layer, not a complete predictive interpretation.
- BSP rules are loaded from backend/app/rules/bsp_rules.json. A rule must have source evidence and a validation case before it can be enabled.
- Astronomical chart calculation is not implemented. Do not display fabricated planetary positions, ascendant or houses.

## Configuration
- Backend CORS origins: comma-separated CORS_ORIGINS.
- Frontend API base URL: NEXT_PUBLIC_API_BASE_URL.
- Local development defaults to http://localhost:8000.
