"""BhriguSetu MCP server.

The astronomy module calculates approximate Lahiri D1/D9 charts. BSP predictive rules remain disabled. Caller-supplied positions can also be mapped.
Run from the backend directory: python -m app.mcp_server
"""
from __future__ import annotations

from datetime import date, datetime, time
from zoneinfo import ZoneInfo

from mcp.server import MCPServer
from mcp.types import ToolAnnotations

from app.astronomy.time import resolve_local_datetime
from app.bcp.engine import analyze_bcp, calculate_running_year
from app.bsp.engine import analyze_bsp
from app.bsp.kakshya import calculate_kakshya, same_degree_number
from app.models import BirthDetails
from app.chart.manual import SuppliedChartInput, analyze_supplied_chart
from app.chart.analysis import analyze_chart_context
from app.astronomy.ephemeris import calculate_natal_chart
from app.astronomy.jhora_provider import JHoraChartRequest, calculate_with_jhora
from app.places import search_places
from app.rules import enabled_rules, load_catalog

mcp = MCPServer(
    "BhriguSetu",
    instructions=(
        "Research-first Jyotish calculation server. Use the existing BhriguSetu "
        "engines as the source of truth. Clearly preserve provisional and "
        "research-pending statuses. Never claim a complete horoscope: planetary "
        "birth details can produce approximate Lahiri D1/D9 positions and whole-sign houses; see chart warnings for model limits."
    ),
)


_READ_ONLY = ToolAnnotations(read_only_hint=True, open_world_hint=False)
_EXTERNAL_READ_ONLY = ToolAnnotations(read_only_hint=True, open_world_hint=True)


@mcp.tool(annotations=_READ_ONLY)
def calculate_running_year_tool(date_of_birth: str, as_of_date: str) -> dict:
    """Calculate BhriguSetu running year from YYYY-MM-DD dates."""
    dob = date.fromisoformat(date_of_birth)
    on_date = date.fromisoformat(as_of_date)
    return {
        "date_of_birth": dob.isoformat(),
        "as_of_date": on_date.isoformat(),
        "running_year": calculate_running_year(dob, on_date),
        "method": "completed_years_plus_one",
    }


@mcp.tool(annotations=_READ_ONLY)
def analyze_bcp_tool(running_year: int) -> dict:
    """Calculate BCP 12-house activation and expose provisional cycle metadata."""
    return analyze_bcp(running_year)


@mcp.tool(annotations=_READ_ONLY)
def analyze_bsp_tool(running_year: int) -> dict:
    """Inspect BSP research candidates; unverified predictive rules stay disabled."""
    return analyze_bsp(running_year)


@mcp.tool(annotations=_READ_ONLY)
def get_bsp_rules_tool() -> dict:
    """Return the source-controlled BSP rule catalog and enabled-rule status."""
    catalog = load_catalog()
    return {
        "method": catalog["method"],
        "schema_version": catalog["schema_version"],
        "total_rules": len(catalog["rules"]),
        "enabled_rule_count": len(enabled_rules()),
        "rules": catalog["rules"],
        "warning": "Research candidates are not production predictions unless independently verified and enabled.",
    }


@mcp.tool(annotations=_READ_ONLY)
def calculate_kakshya_tool(degree_in_sign: float) -> dict:
    """Look up the BSP-7 3°45′ Kakshya slot for a degree within one sign."""
    return calculate_kakshya(degree_in_sign)


@mcp.tool(annotations=_READ_ONLY)
def compare_same_degree_tool(first_degree: float, second_degree: float) -> dict:
    """Compare whole-degree numbers within two signs using the BSP-7 convention."""
    return {
        "first_degree": first_degree,
        "second_degree": second_degree,
        "same_degree_number": same_degree_number(first_degree, second_degree),
        "comparison": "integer degree only; not exact longitude equality",
    }


@mcp.tool(annotations=_EXTERNAL_READ_ONLY)
async def search_birthplace_tool(query: str) -> dict:
    """Search a birthplace through the existing OSM Nominatim integration."""
    results = await search_places(query)
    return {
        "provider": "OpenStreetMap Nominatim",
        "attribution": "© OpenStreetMap contributors",
        "results": results,
    }


@mcp.tool(annotations=_READ_ONLY)
def resolve_birth_timezone_tool(
    birth_date: str,
    time_of_birth: str,
    timezone_name: str,
    time_fold: int | None = None,
) -> dict:
    """Resolve a local birth wall-time, rejecting nonexistent or ambiguous DST times."""
    local = resolve_local_datetime(
        date.fromisoformat(birth_date),
        time.fromisoformat(time_of_birth),
        timezone_name,
        time_fold,
    )
    utc = local.astimezone(ZoneInfo("UTC"))
    return {
        "local_datetime": local.isoformat(),
        "utc_datetime": utc.isoformat(),
        "utc_offset": local.strftime("%z"),
        "time_fold": local.fold,
        "timezone": timezone_name,
    }


@mcp.tool(annotations=_READ_ONLY)
def analyze_birth_details_tool(
    date_of_birth: str,
    time_of_birth: str,
    latitude: float,
    longitude: float,
    timezone_name: str = "Asia/Kolkata",
    place_name: str | None = None,
    as_of_date: str | None = None,
    time_fold: int | None = None,
) -> dict:
    """Run BCP/BSP status analysis and calculate the approximate natal D1/D9 chart."""
    birth = BirthDetails(
        date_of_birth=date.fromisoformat(date_of_birth),
        time_of_birth=time.fromisoformat(time_of_birth),
        latitude=latitude,
        longitude=longitude,
        timezone=timezone_name,
        place_name=place_name,
        as_of_date=date.fromisoformat(as_of_date) if as_of_date else None,
        time_fold=time_fold,
    )
    local_today = datetime.now(ZoneInfo(birth.timezone)).date()
    analysis_date = birth.as_of_date or local_today
    running_year = calculate_running_year(birth.date_of_birth, analysis_date)
    local_birth = birth.resolved_birth_datetime()
    chart = calculate_natal_chart(birth)
    chart_context = analyze_chart_context(running_year, chart)
    return {
        "status": "partial_calculation",
        "methodology_status": "research_pending",
        "analysis_date": analysis_date.isoformat(),
        "birth_details": {
            "date_of_birth": birth.date_of_birth.isoformat(),
            "time_of_birth": birth.time_of_birth.isoformat(),
            "birth_datetime_local": local_birth.isoformat(),
            "birth_datetime_utc": local_birth.astimezone(ZoneInfo("UTC")).isoformat(),
            "utc_offset": local_birth.strftime("%z"),
            "time_fold": local_birth.fold,
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
            "Research foundation only; not a complete horoscope or prediction.",
            "BCP chakra-swami mapping remains provisional pending primary-source verification.",
            "No BSP production prediction rules are enabled.",
        ],
    }


@mcp.tool(annotations=_READ_ONLY)
def calculate_birth_chart_tool(
    date_of_birth: str,
    time_of_birth: str,
    latitude: float,
    longitude: float,
    timezone_name: str = "Asia/Kolkata",
    time_fold: int | None = None,
) -> dict:
    """Calculate an approximate Lahiri sidereal D1/D9 chart from birth details."""
    birth = BirthDetails(
        date_of_birth=date.fromisoformat(date_of_birth),
        time_of_birth=time.fromisoformat(time_of_birth),
        latitude=latitude,
        longitude=longitude,
        timezone=timezone_name,
        time_fold=time_fold,
    )
    return calculate_natal_chart(birth)


@mcp.tool(annotations=_EXTERNAL_READ_ONLY)
async def calculate_jhora_chart_tool(
    date_of_birth: str,
    time_of_birth: str,
    latitude: float,
    longitude: float,
    timezone_name: str = "Asia/Kolkata",
    place_name: str | None = None,
    time_fold: int | None = None,
    ayanamsa_mode: str = "LAHIRI",
    ayanamsa_value: float | None = None,
    node_type: str = "mean",
    calculation_type: str = "drik",
    bhava_madhya_method: int = 5,
    timezone_mode: str = "file",
    language: str = "en",
) -> dict:
    """Calculate a chart via the independent JHora REST API with explicit supported settings.

    This provider call is separate from the approximate in-repository chart engine.
    It does not establish parity with the desktop JHora application.
    """
    request = JHoraChartRequest(
        date_of_birth=date.fromisoformat(date_of_birth),
        time_of_birth=time.fromisoformat(time_of_birth),
        latitude=latitude,
        longitude=longitude,
        timezone=timezone_name,
        place_name=place_name,
        time_fold=time_fold,
        ayanamsa_mode=ayanamsa_mode,
        ayanamsa_value=ayanamsa_value,
        node_type=node_type,
        calculation_type=calculation_type,
        bhava_madhya_method=bhava_madhya_method,
        timezone_mode=timezone_mode,
        language=language,
    )
    return await calculate_with_jhora(request)


@mcp.tool(annotations=_READ_ONLY)
def analyze_supplied_chart_tool(
    running_year: int,
    lagna_longitude: float,
    planetary_longitudes: dict[str, float],
    ayanamsha: str = "unspecified",
) -> dict:
    """Map caller-supplied sidereal longitudes to signs and whole-sign houses; no ephemeris."""
    chart = SuppliedChartInput(
        running_year=running_year,
        lagna_longitude=lagna_longitude,
        planetary_longitudes=planetary_longitudes,
        ayanamsha=ayanamsha,
    )
    return analyze_supplied_chart(chart)


@mcp.tool(annotations=_READ_ONLY)
def get_system_status_tool() -> dict:
    """Report the calculation and methodology capabilities currently available."""
    catalog = load_catalog()
    return {
        "service": "BhriguSetu MCP",
        "status": "operational",
        "bcp": "running-year and 12-house activation available; cycle labels provisional",
        "bsp": "research catalog available; predictive matching disabled",
        "kakshya": "3°45′ lookup and same-degree comparison available",
        "birthplace": "OSM Nominatim search and timezone candidate lookup available",
        "chart_calculation": "available_with_approximate_lahiri_model",
        "chart_calculation_scope": "birth_details_geocentric_planets_ascendant_whole_sign_d1_d9",
        "ephemeris": "Astronomy Engine 2.1.19; approximate Lahiri polynomial; mean lunar node",
        "manual_chart_mapping": "available_for_caller_supplied_sidereal_positions",
        "enabled_bsp_rules": len(enabled_rules()),
        "research_candidates": len(catalog["rules"]),
    }


@mcp.resource("bhrigusetu://methodology")
def methodology_resource() -> str:
    """Describe calculation boundaries and evidence status."""
    return (
        "BhriguSetu is a research-first BCP/BSP application. Running year is "
        "completed calendar years + 1. BCP house activation is "
        "((running_year - 1) % 12) + 1; cycle is ((running_year - 1) // 12) + 1. "
        "The chakra-swami sequence is provisional pending primary-source "
        "verification. BSP candidates remain disabled until their sources, "
        "preconditions and validation cases are verified. Kakshya lookup is "
        "a deterministic 3°45′ slot lookup. Planetary positions, ascendant, "
        "whole-sign D1/D9 chart calculation is available with explicit precision and ayanamsha warnings."
    )


@mcp.prompt()
def jyotish_research_analysis(question: str) -> str:
    """Prepare a cautious, evidence-graded Jyotish research analysis."""
    return (
        "Analyze the following Jyotish question using a research-first method: "
        f"{question}\n\nSeparate classical textual evidence, modern interpretation, "
        "and empirical claims. State exact source references where available. "
        "Do not turn provisional BCP/BSP mappings into established rules. "
        "Explain cause → mechanism → result, list assumptions, and state what "
        "cannot be concluded from the available chart data."
    )


def main() -> None:
    """Start the local stdio MCP transport."""
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
