# BhriguSetu Architecture

## System flow

~~~mermaid
flowchart TD
    UI["Next.js interface"] --> API["FastAPI API"]
    API --> TIME["Birth-time and timezone validation"]
    API --> BCP["BCP calculation layer"]
    API --> BSP["BSP research catalogue"]
    API --> CHART["Chart calculation layer"]
    CHART --> LOCAL["In-repo approximate astronomy engine"]
    CHART -. planned adapter .-> JH["External JHora API / MCP"]
    BCP --> EVIDENCE["Source and evidence records"]
    BSP --> EVIDENCE
    CHART --> REPORT["Result metadata and warnings"]
    EVIDENCE --> REPORT
    REPORT --> UI
    MCP["MCP tool registry"] --> API
~~~

## Component responsibilities

- **Frontend:** collects birth details, displays results and exposes user-facing controls. It is not the calculation source of truth.
- **FastAPI:** validates requests, resolves birth-time context and orchestrates calculation modules.
- **Time layer:** resolves local civil time using an IANA timezone. Nonexistent DST wall times are rejected; repeated times require an explicit fold choice. The API returns local and UTC instants for reproducibility.
- **BCP layer:** calculates running year and the current 12-house activation arithmetic. This is not a complete predictive interpretation.
- **BSP layer:** reads source-controlled research candidates. Predictive rules remain disabled until provenance, preconditions and worked examples are verified.
- **Chart layer:** currently calculates an approximate sidereal D1/D9 chart using Astronomy Engine 2.1.19, an approximate Lahiri polynomial, mean lunar node and whole-sign houses.
- **Manual chart mapping:** maps caller-supplied sidereal longitudes; it does not calculate or independently verify their astronomical source.
- **MCP layer:** exposes existing BhriguSetu functions through local stdio and authenticated remote Streamable HTTP.

## Calculation authority and provider boundary

Jagannatha Hora is the project's target reference for chart-calculation validation. The public JHora API/MCP service is being evaluated as an external provider; it is separate from the desktop software and must be labelled accurately.

A provider adapter must preserve exact request settings and provider revision. Unsupported options must be rejected or marked unavailable, never silently replaced. A JHora parity claim requires reference fixtures and documented angular-error comparisons.

## Research and evidence boundaries

- Modern teacher interpretations and classical textual evidence are stored as distinct evidence classes.
- Priority modern sources: Sunil John, then Deepanshu Giri, then Sanjay Rath.
- Other authors remain supplementary and explicitly attributed.
- Conflicts are recorded rather than averaged.
- No BSP predictive rule is enabled without source provenance, preconditions and regression tests.

## Configuration

- CORS_ORIGINS: comma-separated allowed frontend origins.
- NEXT_PUBLIC_API_BASE_URL: frontend API base URL.
- BHRIGUSETU_MCP_TOKEN: Bearer token required by the remote MCP route.

Local development defaults to http://localhost:8000.

## Astronomy dependency and release gate

The current chart engine is approximate and is not certified against desktop JHora. Swiss Ephemeris is not installed; its AGPL-versus-professional licensing decision must be resolved before integration.

Before promoting a calculation provider to authoritative status:

1. Record the engine, version, time scale and coordinate conventions.
2. Record ayanamsha, node, observer, position and house-system settings.
3. Compare longitudes and ascendant against controlled reference charts.
4. Test nakshatra, pada, sign and varga boundaries.
5. Publish tolerances, known limitations and a reproducibility receipt.

See [Astronomy and licensing](../research/ASTRONOMY_AND_LICENSING.md) and [JHora validation issue #26](https://github.com/beshivaayy/bhrigusetu/issues/26).
