# BhriguSetu Architecture

## System flow

~~~mermaid
flowchart TD
    USER["User / MCP client"] --> UI["Next.js interface"]
    UI --> API["FastAPI API"]
    API --> TIME["Birth-time and timezone validation"]
    API --> BCP["BCP calculation layer"]
    API --> BSP["BSP research catalogue"]
    API --> CHART["Chart calculation layer"]
    CHART --> JH["Jagannatha Hora public REST API"]
    CHART --> LOCAL["Approximate Astronomy Engine fallback (explicit only)"]
    UI --> LIB["Granthalaya catalogue"]
    BCP --> EVIDENCE["Source and evidence records"]
    BSP --> EVIDENCE
    CHART --> RECEIPT["Calculation receipt and limitations"]
    EVIDENCE --> REPORT["Structured result"]
    RECEIPT --> REPORT
    REPORT --> UI
    MCP["MCP tool registry"] --> API
~~~

## Component responsibilities

- **Frontend:** Next.js homepage, Jyotisha calculator workspace and Granthalaya catalogue. It collects inputs and displays provider receipts; it is not the calculation source of truth.
- **Granthalaya:** first searchable catalogue release with source-aware classical text records, project research notes and a curated study path. External Archive.org catalogue searches are not represented as verified full-text editions. Persistent accounts, reading progress, bookmarks, full-text hosting and editorial publishing workflows remain future work.
- **FastAPI:** validates requests, resolves birth-time context and orchestrates calculation modules.
- **Time layer:** resolves local civil time using an IANA timezone. Nonexistent DST wall times are rejected; repeated times require an explicit fold choice. The API returns local and UTC instants for reproducibility.
- **BCP layer:** calculates running year and current 12-house activation arithmetic. This is not a complete predictive interpretation.
- **BSP layer:** reads source-controlled research candidates. Predictive rules remain disabled until provenance, preconditions, worked examples and regression tests are verified.
- **Chart layer:** the primary integrated chart path is the independent Jagannatha Hora public REST API. The in-repository Astronomy Engine calculation remains approximate and must be selected explicitly; it is not desktop-JHora parity.
- **Manual chart mapping:** maps caller-supplied sidereal longitudes; it does not calculate or independently verify their astronomical source.
- **MCP layer:** exposes existing BhriguSetu functions through local stdio and authenticated remote Streamable HTTP. An optional Gemini second-opinion tool sends only explicitly supplied task/context to Google; it does not automatically export birth/chart data.

## Calculation provider boundary

The Jagannatha Hora public REST API is an external calculation provider, separate from the desktop astrology application and its author. BhriguSetu preserves requested settings, provider-applied settings, engine revision, timezone receipt and request notes where returned. The default timezone mode is automatic historical lookup. Unsupported settings must be rejected or marked unavailable, never silently replaced.

Desktop-JHora parity is not established. It requires authorized desktop reference exports with identical birth inputs and settings, plus documented angular-error comparisons for graha longitudes, Lagna, ayanamsha, nakshatra/pada, vargas and Bhava Chalit.

## Research and evidence boundaries

- Modern teacher interpretations and classical textual evidence are stored as distinct evidence classes.
- Priority modern sources: Sunil John, then Deepanshu Giri, then Sanjay Rath.
- Other authors remain supplementary and explicitly attributed.
- Conflicts are recorded rather than averaged.
- No BSP predictive rule is enabled without source provenance, preconditions and regression tests.

## Configuration

- `CORS_ORIGINS`: comma-separated allowed frontend origins.
- `NEXT_PUBLIC_API_BASE_URL`: frontend API base URL.
- `BHRIGUSETU_MCP_TOKEN`: Bearer token required by the remote MCP route.
- `GEMINI_API_KEY`: optional Google Gemini Developer API key for `consult_gemini_tool`.
- `GEMINI_MODEL`: optional Gemini model override (default `gemini-3.8-flash`).
- `JHORA_API_BASE_URL`: optional override for the Jagannatha Hora public REST API endpoint.

## Astronomy dependency and release gate

The in-repo chart engine uses Astronomy Engine 2.1.19 and an approximate Lahiri model. Swiss Ephemeris is not installed; its AGPL-versus-professional licensing decision must be resolved before integration. Do not describe the approximate engine as an authoritative replacement for the external provider.

Before promoting any calculation provider to a precision claim:
1. Record engine, version, time scale and coordinate conventions.
2. Record ayanamsha, node, observer, position and house-system settings.
3. Compare longitudes and ascendant against controlled reference charts.
4. Test nakshatra, pada, sign and varga boundaries.
5. Publish tolerances, known limitations and a reproducibility receipt.

See [Astronomy and licensing](../research/ASTRONOMY_AND_LICENSING.md) and [JHora validation issue #26](https://github.com/beshivaayy/bhrigusetu/issues/26).
