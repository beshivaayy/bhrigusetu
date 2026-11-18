# BhriguSetu MCP Server

BhriguSetu exposes its existing calculation and research functions through the Model Context Protocol (MCP). The same tool registry is available locally over stdio and remotely over Streamable HTTP at /mcp on the existing FastAPI service.

## Remote endpoint

`https://bhrigusetu-api.onrender.com/mcp`

The same tool registry is available locally over stdio and remotely over Streamable HTTP at `/mcp` on the existing FastAPI service. The MCP adapter does not replace the frontend or calculation engines.

## Current tools

- `analyze_birth_details_tool` — validated partial birth analysis (running year, BCP, BSP status).
- `calculate_birth_chart_tool` — calculates an approximate natal chart using the in-repository Astronomy Engine implementation; it is not JHora parity.
- `calculate_jhora_chart_tool` — calls the independent Jagannatha Hora public REST API with explicit ayanamsha, Mean/True node, calculation type, Bhava Madhya and language settings; this is not desktop-JHora parity.
- `analyze_supplied_chart_tool` — maps caller-supplied sidereal longitudes to signs and whole-sign houses; does not verify their ephemeris.
- `calculate_running_year_tool` — running-year arithmetic.
- `analyze_bcp_tool` — BCP house activation and provisional cycle metadata.
- `analyze_bsp_tool` / `get_bsp_rules_tool` — research candidates and evidence status.
- `calculate_kakshya_tool` / `compare_same_degree_tool` — deterministic BSP-7 lookup utilities.
- `search_birthplace_tool` — existing OSM Nominatim search.
- `resolve_birth_timezone_tool` — existing DST-safe local birth-time resolution.
- `get_system_status_tool` — capability and methodology status.
- `consult_gemini_tool` — optional Gemini second-opinion tool; only caller-supplied task/context is sent to Google.
- `POST /api/ai/gemini` — authenticated REST entry point used by the BhriguSetu Gemini Workspace; accepts only explicit task/context and reuses the same Gemini service.

### Manual chart tool example

Call `analyze_supplied_chart_tool` with:

~~~json
{
  "running_year": 27,
  "lagna_longitude": 285.5,
  "ayanamsha": "Lahiri",
  "planetary_longitudes": {
    "Sun": 245.2,
    "Moon": 195.4,
    "Mars": 303.8,
    "Jupiter": 1.4,
    "Saturn": 16.5
  }
}
~~~

The remote endpoint is protected by a Bearer token configured as BHRIGUSETU_MCP_TOKEN in the API service environment. The token must also be available to the MCP client. Never commit or publish the token. The health endpoint remains public; the MCP route requires authentication.

MCP is mounted inside the existing API service. It does not require a second Render service.

## Current tool catalogue

| Tool | Purpose |
| --- | --- |
| calculate_running_year_tool | Calculate completed-years-plus-one running year |
| analyze_bcp_tool | BCP 12-house activation and provisional cycle metadata |
| analyze_bsp_tool | Inspect BSP research candidates and status |
| get_bsp_rules_tool | Read the source-controlled BSP rule catalogue |
| calculate_kakshya_tool | Look up a BSP-7 3°45′ Kakshya slot |
| compare_same_degree_tool | Compare integer degree numbers |
| search_birthplace_tool | Search birthplace candidates using Nominatim |
| resolve_birth_timezone_tool | Resolve local wall time, UTC offset and DST fold |
| analyze_birth_details_tool | Run birth analysis and return the current approximate chart |
| calculate_birth_chart_tool | Calculate the in-repo approximate D1/D9 chart |
| calculate_jhora_chart_tool | Call the independent JHora public REST API with explicit supported settings |
| analyze_supplied_chart_tool | Map caller-supplied sidereal longitudes; does not calculate an ephemeris |
| get_system_status_tool | Report current calculation and methodology capabilities |

Additional interfaces:
- Resource: bhrigusetu://methodology
- Prompt: jyotish_research_analysis

Tool schemas are discoverable at runtime through MCP tools/list. The live schema is authoritative.

## Calculation scope and limitations

The in-repo chart engine currently uses Astronomy Engine 2.1.19 and an approximate Lahiri polynomial. It calculates the seven classical planets, mean Rahu/Ketu, sidereal ascendant, whole-sign houses, nakshatra/pada and D1/D9 mapping.

It does not currently provide:
- A verified desktop Jagannatha Hora calculation match.
- True lunar node in the in-repo engine.
- User-selectable ayanamsha modes in the in-repo engine.
- Selectable Bhava / house systems in the in-repo engine.
- A certified apparent/mean or geocentric/topocentric option matrix.
- A validated full divisional-chart range.

Chart output includes provider metadata and warnings. Treat this as an approximate research implementation, not a production-precision horoscope.

## JHora provider is a separate integration

A public Jagannatha Hora API and MCP service is documented here:
**Authentication and privacy:** the remote `/mcp` route requires a Bearer token configured through `BHRIGUSETU_MCP_TOKEN`; requests without a valid token receive HTTP 401. Keep the token in the hosting provider's secret/environment settings and never commit it. This token protects only the remote MCP route, not the other FastAPI routes. The registered MCP tools are read-only (calculations, lookups and research status); they do not mutate data or persist birth details. Do not send passwords, API keys, or other secrets through tool arguments. Before exposing write-capable or private-data tools, add user-level authorization, audit logging and appropriate privacy controls.

- REST API: https://jagannathahora.com/api-mcp
- MCP guide: https://jagannathahora.com/api-mcp/mcp-usage
- MCP endpoint: https://jagannatha-hora-359167915530.europe-west1.run.app/mcp

The public API documents multiple ayanamsha identifiers and a mean/true node option for supported REST endpoints. Its documentation states that the service is independent and is not affiliated with the desktop astrology software or its author.

BhriguSetu integrates the public REST provider through `POST /api/chart/jhora` and the `calculate_jhora_chart_tool` MCP tool. The BhriguSetu adapter sends only the documented settings it validates, returns the provider engine revision and applied-setting receipt, and does not silently fall back to the approximate engine. Connecting a client directly to the public JHora MCP endpoint remains a separate integration. Do not assume observer modes or position conventions are supported merely because they are common in astrology software.
ChatGPT custom MCP connections require a remote HTTPS endpoint; the local stdio command above cannot be entered directly. **Do not choose “No authentication” for this endpoint:** remote `/mcp` requires a Bearer token. Use only a client connection flow that explicitly supports the required Bearer-token authentication, and store the token in that client's secure credential field. Never put the token in a URL, README, source file or screenshot. If the selected ChatGPT connection flow does not offer a compatible authentication method, do not expose the MCP endpoint without authentication as a workaround; continue using the already configured local Claude Code MCP connection until a supported secure connection method is available.

## Local stdio setup (Windows PowerShell)

Run from the backend directory:

~~~powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.mcp_server
~~~

The stdio transport is intended for local MCP clients. Do not write ordinary text to the server's stdout while an MCP client is connected; stdout carries protocol messages.

## Claude Code remote setup

The remote endpoint can be registered at user scope. Keep the token in the Windows user environment variable BHRIGUSETU_MCP_TOKEN. Do not paste the token into a project file or source control. If the server is already registered and connected, do not add a duplicate. Use the authenticated connection already configured for this machine.

## API routes

- GET /health — service health.
- POST /api/analyze — running year, BCP/BSP status and chart context.
- POST /api/chart/calculate — approximate birth-chart calculation.
- POST /api/chart/jhora — independent JHora public REST provider calculation; no approximate fallback.
- POST /api/chart/manual — mapping of caller-supplied sidereal longitudes.
- GET /api/places/search — one-shot birthplace search.
- /mcp — authenticated remote MCP endpoint.

The FastAPI OpenAPI page is available at /docs on the deployed API host or local development server.

## Security and privacy

- Remote MCP requests require a Bearer token.
- Do not expose the token in frontend variables, screenshots, public issue comments or repository files.
- Registered tools are read-only calculations, lookups and research reads; they do not provide a write interface.
- Birth details are processed by the calculation request. Review hosting and external-provider privacy policies before sending personal data.
- Birthplace search uses OpenStreetMap Nominatim and must follow its usage policy and attribution requirements.
- BCP running-year and house-activation calculations reuse the existing engine.
- The chakra-swami sequence remains provisional.
- BSP predictive candidates remain disabled until source verification and validation.
- `calculate_birth_chart_tool` remains the approximate in-repository engine: Astronomy Engine 2.1.19, approximate Lahiri polynomial, Mean Nodes and Whole Sign houses, with D1/D9 mapping. It is not validated for JHora parity.
- `calculate_jhora_chart_tool` calls the separate public REST provider. It exposes the provider's documented ayanamsha modes, Mean/True nodes, Drik/Surya Siddhanta, Bhava Madhya methods 1–5 and language options. The provider's returned engine revision and request notes are passed through. This is labelled public API output, not desktop-JHora parity.
- Caller-supplied sidereal positions can separately be mapped to signs and whole-sign houses without validating their astronomical source. The chart layer does not enable BSP predictions; BSP candidates remain disabled.
- Birthplace lookup uses OpenStreetMap Nominatim and retains its attribution.
- Local stdio use needs no API key or cloud service. Remote MCP uses the existing API deployment.

## Tests

From the backend directory:

~~~powershell
python -m pytest -q
~~~

For manual chart input details, see [MANUAL_CHART_IMPORT.md](MANUAL_CHART_IMPORT.md). For calculation precision and licensing, see [ASTRONOMY_AND_LICENSING.md](../research/ASTRONOMY_AND_LICENSING.md).


## Gemini second-opinion integration

BhriguSetu can optionally call the Gemini Developer API through the official Google GenAI Python SDK. Configure `GEMINI_API_KEY` on the backend service and optionally `GEMINI_MODEL` (default: `gemini-3.8-flash`). The MCP tool is named `consult_gemini_tool`.

The tool is deliberately explicit: only its caller-supplied `task` and optional `context` are sent to Google. It does not automatically attach birth details, chart outputs, repository files, API credentials or other BhriguSetu data. Do not include secrets or personal birth data unless you have a clear reason and accept Google's applicable data terms. Gemini output is an independent model response, not verified source evidence, a calculation result or an authorized code change. Review all suggestions before implementation.

If `GEMINI_API_KEY` is absent, the tool reports `not_configured` and does not make a network request. Keep the key in the Render service's environment settings; never commit it or pass it as an MCP argument.


## Gemini AI Workspace

The frontend route `/ai-workspace` provides a direct Gemini conversation interface. It calls `POST /api/ai/gemini` through the same-origin `/backend-api` rewrite. The endpoint is protected by the existing `BHRIGUSETU_MCP_TOKEN` bearer token; it does not introduce a second secret or expose the Google API key.

Open the workspace, enter the existing MCP bearer token in the password field, and send a task. The token is held only in component memory and is not written to localStorage/sessionStorage. The conversation is held in page memory for that browser session. Gemini receives the task, the optional context explicitly entered by the user, and the visible recent conversation transcript. Repository files are not attached automatically.

Gemini responses are independent suggestions. This interface cannot read or modify GitHub files, create commits, or deploy code. Review and implement any suggested changes separately. Never paste the Google Gemini API key into the workspace; it remains server-side as `GEMINI_API_KEY`.


For the complete ChatGPT-to-Gemini delegation workflow, custom MCP connection requirements and privacy boundaries, see [CHATGPT_GEMINI_COLLABORATION.md](CHATGPT_GEMINI_COLLABORATION.md).


For the live Jagannatha Hora REST contract, exposed settings, unsupported calculation modes and outstanding parity tests, see [JHORA_PROVIDER_CAPABILITIES.md](JHORA_PROVIDER_CAPABILITIES.md).
