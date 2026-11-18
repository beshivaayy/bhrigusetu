import os
import secrets
from contextlib import asynccontextmanager
from datetime import datetime
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .models import BirthDetails
from .bcp.engine import calculate_running_year
from .rules import load_catalog, enabled_rules
from .places import InvalidPlaceQuery, search_places
from .chart.manual import SuppliedChartInput, analyze_supplied_chart
from .chart.analysis import analyze_chart_context
from .astronomy.ephemeris import calculate_natal_chart
from .astronomy.jhora_provider import JHoraChartRequest, calculate_with_jhora
from .mcp_server.server import mcp as bhrigusetu_mcp

# Mount the same MCP tool registry under /mcp on the existing API service.
# Local stdio clients continue to use: python -m app.mcp_server
mcp_http_app = bhrigusetu_mcp.streamable_http_app(
    json_response=True,
    stateless_http=True,
    host="0.0.0.0",
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # A mounted ASGI sub-app does not own the parent FastAPI lifespan.
    async with bhrigusetu_mcp.session_manager.run():
        yield


app = FastAPI(
    title="BhriguSetu API",
    version="0.4.0",
    description="Research-first BCP and BSP application. Unverified predictive rules are disabled.",
    lifespan=lifespan,
)
_default_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
_configured_origins = [item.strip() for item in os.getenv("CORS_ORIGINS", "").split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_configured_origins or _default_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept", "Authorization", "MCP-Protocol-Version", "Mcp-Session-Id"],
)


@app.middleware("http")
async def protect_remote_mcp(request: Request, call_next):
    """Require a configured bearer token for the public Streamable HTTP MCP route."""
    if request.url.path == "/mcp" or request.url.path.startswith("/mcp/"):
        expected = os.getenv("BHRIGUSETU_MCP_TOKEN", "").strip()
        if not expected:
            return JSONResponse(
                status_code=503,
                content={"detail": "Remote MCP authentication is not configured."},
            )
        supplied = request.headers.get("authorization", "")
        scheme, _, token = supplied.partition(" ")
        if scheme.lower() != "bearer" or not token or not secrets.compare_digest(token, expected):
            return JSONResponse(
                status_code=401,
                content={"detail": "A valid bearer token is required for remote MCP access."},
                headers={"WWW-Authenticate": "Bearer"},
            )
    return await call_next(request)


@app.get("/health")
def health():
    return {"status": "ok", "service": "bhrigusetu-api", "version": app.version}


@app.get("/api/places/search")
async def place_search(q: str = Query(min_length=3, max_length=120)):
    try:
        results = await search_places(q)
    except InvalidPlaceQuery as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except (httpx.HTTPError, ValueError):
        raise HTTPException(status_code=503, detail="Birthplace search is temporarily unavailable. You can enter coordinates manually.")
    return {
        "provider": "OpenStreetMap Nominatim",
        "attribution": "© OpenStreetMap contributors",
        "results": results,
    }


@app.get("/api/rules/status")
def rule_status():
    catalog = load_catalog()
    return {
        "method": catalog["method"],
        "total_rules": len(catalog["rules"]),
        "enabled_rules": len(enabled_rules()),
        "status": "research_pending" if not enabled_rules() else "rules_available",
    }


@app.post("/api/analyze")
def analyze(birth: BirthDetails):
    local_today = datetime.now(ZoneInfo(birth.timezone)).date()
    analysis_date = birth.as_of_date or local_today
    running_year = calculate_running_year(birth.date_of_birth, analysis_date)
    birth_local = birth.resolved_birth_datetime()
    birth_utc = birth_local.astimezone(ZoneInfo("UTC"))
    chart = calculate_natal_chart(birth)
    chart_context = analyze_chart_context(running_year, chart)
    return {
        "status": "partial_calculation",
        "methodology_status": "research_pending",
        "analysis_date": analysis_date.isoformat(),
        "birth_details": {
            "date_of_birth": birth.date_of_birth.isoformat(),
            "time_of_birth": birth.time_of_birth.isoformat(),
            "birth_datetime_local": birth_local.isoformat(),
            "birth_datetime_utc": birth_utc.isoformat(),
            "utc_offset": birth_local.strftime("%z"),
            "time_fold": birth_local.fold,
            "place_name": birth.place_name,
            "latitude": birth.latitude,
            "longitude": birth.longitude,
            "timezone": birth.timezone,
        },
        "running_year": running_year,
        "bcp": chart_context["bcp"],
        "bsp": chart_context["bsp"],
        "bcp_cycle_reference": chart_context["bcp_cycle_reference"],
        "chart": chart,
        "warnings": [
            "This is a research foundation, not a complete horoscope or prediction.",
            "BCP house activation follows the current working arithmetic; chakra-swami mapping still requires primary-source verification.",
            "No BSP prediction rules are enabled.",
            "Chart uses Astronomy Engine with an approximate Lahiri ayanamsha; review chart warnings before precision-sensitive use.",
        ],
    }


@app.post("/api/chart/calculate")
def calculate_birth_chart(birth: BirthDetails):
    """Calculate D1/D9 sidereal positions and whole-sign houses from birth details."""
    return calculate_natal_chart(birth)


@app.post("/api/chart/jhora")
async def calculate_jhora_birth_chart(request: JHoraChartRequest):
    """Calculate a natal chart through the independent Jagannatha Hora public REST API."""
    return await calculate_with_jhora(request)


@app.post("/api/chart/manual")
def manual_chart_analysis(chart: SuppliedChartInput):
    """Map externally supplied sidereal longitudes; does not calculate an ephemeris."""
    return analyze_supplied_chart(chart)

# Mount last so existing FastAPI routes keep precedence.
app.mount("/", mcp_http_app)
