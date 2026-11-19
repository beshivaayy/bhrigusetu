import asyncio

from app.mcp_server.server import (
    mcp,
    analyze_bcp_tool,
    analyze_bsp_tool,
    analyze_supplied_chart_tool,
    calculate_kakshya_tool,
    calculate_birth_chart_tool,
    calculate_running_year_tool,
    compare_same_degree_tool,
    get_bsp_rules_tool,
    get_system_status_tool,
)


def test_mcp_running_year_tool_uses_existing_engine():
    result = calculate_running_year_tool("2000-01-01", "2026-01-01")
    assert result["running_year"] == 27


def test_mcp_bcp_tool_preserves_provisional_status():
    result = analyze_bcp_tool(25)
    assert result["activated_house"] == 1
    assert result["chakra_swami_status"] == "pending_primary_source_verification"


def test_mcp_bsp_tool_does_not_enable_research_candidates():
    result = analyze_bsp_tool(25)
    assert result["enabled_rule_count"] == 0
    assert result["triggered_rules"] == []


def test_mcp_rule_catalog_exposes_evidence_and_disabled_state():
    result = get_bsp_rules_tool()
    assert result["total_rules"] == 5
    assert result["enabled_rule_count"] == 0
    assert all(not rule["enabled"] for rule in result["rules"])


def test_mcp_kakshya_tool():
    result = calculate_kakshya_tool(0)
    assert result["lord"] == "Saturn"
    assert result["index"] == 1


def test_mcp_same_degree_tool_compares_integer_degree():
    result = compare_same_degree_tool(27.14, 27.50)
    assert result["same_degree_number"] is True


def test_mcp_status_reports_chart_engine_and_keeps_bsp_disabled():
    result = get_system_status_tool()
    assert result["chart_calculation"] == "available_with_approximate_lahiri_model"
    assert result["enabled_bsp_rules"] == 0



def test_mcp_manual_chart_tool_uses_shared_engine():
    result = analyze_supplied_chart_tool(1, 0, {"Moon": 60, "Mars": 10})
    assert result["planets"]["Moon"]["whole_sign_house"] == 3
    assert result["bcp_cycle_reference"]["status"] == "provisional_secondary_source_only"
    assert result["bsp"]["triggered_rules"] == []



def test_mcp_tools_explicitly_advertise_read_only_behavior():
    tools = asyncio.run(mcp.list_tools())
    by_name = {tool.name: tool for tool in tools}

    assert tools
    assert all(tool.annotations is not None for tool in tools)
    assert all(tool.annotations.read_only_hint is True for tool in tools)
    assert by_name["search_birthplace_tool"].annotations.open_world_hint is True
    assert by_name["analyze_bcp_tool"].annotations.open_world_hint is False


def test_jhora_mcp_tool_exposes_optional_gender_setting():
    tools = asyncio.run(mcp.list_tools())
    by_name = {tool.name: tool for tool in tools}
    schema = by_name["calculate_jhora_chart_tool"].input_schema
    assert "gender" in schema["properties"]
    gender_schema = schema["properties"]["gender"]
    gender_values = set(gender_schema.get("enum", []))
    for branch in gender_schema.get("anyOf", []):
        gender_values.update(branch.get("enum", []))
    assert gender_values == {"male", "female"}


def test_mcp_birth_chart_tool_returns_d1_d9_and_whole_sign_houses():
    result = calculate_birth_chart_tool(
        "2000-01-01", "00:00:00", 0.0, 0.0, "UTC"
    )
    assert result["status"] == "calculated_with_approximate_lahiri_model"
    assert result["house_system"] == "whole_sign"
    assert len(result["houses"]) == 12
    assert "Moon" in result["planets"]
    assert "Rahu" in result["planets"] and "Ketu" in result["planets"]
    assert result["divisional_charts"]["D9"]["lagna"]["sign"]
    assert result["warnings"]


