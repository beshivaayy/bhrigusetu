# BhriguSetu MCP Server

The MCP adapter exposes existing BhriguSetu capabilities to MCP-compatible clients. It does not replace the FastAPI API, frontend, or calculation engines.

## Current tools

- `analyze_birth_details_tool` — validated partial birth analysis (running year, BCP, BSP status).
- `calculate_running_year_tool` — running-year arithmetic.
- `analyze_bcp_tool` — BCP house activation and provisional cycle metadata.
- `analyze_bsp_tool` / `get_bsp_rules_tool` — research candidates and evidence status.
- `calculate_kakshya_tool` / `compare_same_degree_tool` — deterministic BSP-7 lookup utilities.
- `search_birthplace_tool` — existing OSM Nominatim search.
- `resolve_birth_timezone_tool` — existing DST-safe local birth-time resolution.
- `get_system_status_tool` — capability and methodology status.

Resource: `bhrigusetu://methodology`

Prompt: `jyotish_research_analysis`

## Local setup (Windows PowerShell)

Run from the repository's `backend` directory:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.mcp_server
```

The server uses stdio. Do not type into its terminal while an MCP client is connected; stdout is reserved for protocol messages.

## Claude Desktop configuration

Replace the path with your actual absolute backend path. Use the same Python environment where requirements were installed.

```json
{
  "mcpServers": {
    "bhrigusetu": {
      "command": "C:\\path\\to\\bhrigusetu\\backend\\.venv\\Scripts\\python.exe",
      "args": ["-m", "app.mcp_server"],
      "cwd": "C:\\path\\to\\bhrigusetu\\backend"
    }
  }
}
```

Restart Claude Desktop after saving the configuration.

## Scope and safeguards

- BCP running-year and house-activation calculations reuse the existing engine.
- The chakra-swami sequence remains provisional.
- BSP predictive candidates remain disabled until source verification and validation.
- Planetary positions, ascendant, houses, and a complete horoscope are not implemented.
- Birthplace lookup uses OpenStreetMap Nominatim and retains its attribution.
- No API key, paid model, cloud service, or new hosting is required for local stdio use.

## Tests

From `backend`:

```powershell
python -m pytest
```
