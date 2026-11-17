# BhriguSetu MCP Server

BhriguSetu exposes its existing calculation and research functions through the Model Context Protocol (MCP). The same tool registry is available locally over stdio and remotely over Streamable HTTP at /mcp on the existing FastAPI service.

## Remote endpoint

~~~text
https://bhrigusetu-api.onrender.com/mcp
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

- REST API: https://jagannathahora.com/api-mcp
- MCP guide: https://jagannathahora.com/api-mcp/mcp-usage
- MCP endpoint: https://jagannatha-hora-359167915530.europe-west1.run.app/mcp

The public API documents multiple ayanamsha identifiers and a mean/true node option for supported REST endpoints. Its documentation states that the service is independent and is not affiliated with the desktop astrology software or its author.

Connecting a client directly to that public MCP endpoint is not the same as integrating it into BhriguSetu. Before integration, inspect the live tool schemas and verify each setting. Do not assume house systems, observer modes or position conventions are supported merely because they are common in astrology software.

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

## Tests

From the backend directory:

~~~powershell
python -m pytest -q
~~~

For manual chart input details, see [MANUAL_CHART_IMPORT.md](MANUAL_CHART_IMPORT.md). For calculation precision and licensing, see [ASTRONOMY_AND_LICENSING.md](../research/ASTRONOMY_AND_LICENSING.md).
