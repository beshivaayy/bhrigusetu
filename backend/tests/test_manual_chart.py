import pytest
from pydantic import ValidationError
from app.chart.manual import SuppliedChartInput, analyze_supplied_chart


def test_whole_sign_wrap_and_sign_boundaries():
    chart = SuppliedChartInput(running_year=27, lagna_longitude=350,
        planetary_longitudes={"Mars": 0, "Jupiter": 29.999, "Saturn": 30})
    result = analyze_supplied_chart(chart)
    assert result["lagna"]["sign"] == "Pisces"
    assert result["planets"]["Mars"]["whole_sign_house"] == 2
    assert result["planets"]["Jupiter"]["degree_in_sign"] == 29.999
    assert result["planets"]["Saturn"]["sign"] == "Taurus"
    assert result["planets"]["Saturn"]["whole_sign_house"] == 3


def test_bcp_parallel_reference_is_provisional():
    chart = SuppliedChartInput(running_year=1, lagna_longitude=0,
        planetary_longitudes={"Moon": 60, "Mars": 10, "Jupiter": 20, "Saturn": 30})
    ref = analyze_supplied_chart(chart)["bcp_cycle_reference"]
    assert ref["status"] == "provisional_secondary_source_only"
    assert ref["chakra_swami"] == "Moon"
    assert ref["reference_sign"] == "Gemini"
    assert ref["corresponding_lagna_house"] == 3
    result = analyze_supplied_chart(chart)
    assert result["bcp"]["cycle_ruler_reference_status"] == "provisional_secondary_source_only"


def test_missing_cycle_lord_is_not_guessed():
    chart = SuppliedChartInput(running_year=1, lagna_longitude=0, planetary_longitudes={"Mars": 10})
    ref = analyze_supplied_chart(chart)["bcp_cycle_reference"]
    assert ref["status"] == "cycle_lord_position_not_supplied"
    assert "corresponding_lagna_house" not in ref


def test_cycle_ten_does_not_wrap():
    chart = SuppliedChartInput(running_year=109, lagna_longitude=0, planetary_longitudes={"Ketu": 10})
    ref = analyze_supplied_chart(chart)["bcp_cycle_reference"]
    assert ref["cycle"] == 10 and ref["chakra_swami"] is None
    assert ref["status"] == "unavailable_cycle_outside_secondary_sequence"


@pytest.mark.parametrize("longitude", [-0.01, 360, float("nan"), float("inf")])
def test_invalid_planet_longitude_rejected(longitude):
    with pytest.raises(ValidationError):
        SuppliedChartInput(running_year=1, lagna_longitude=0, planetary_longitudes={"Mars": longitude})


def test_unknown_planet_rejected():
    with pytest.raises(ValidationError):
        SuppliedChartInput(running_year=1, lagna_longitude=0, planetary_longitudes={"Pluto": 10})


def test_invalid_lagna_rejected():
    with pytest.raises(ValidationError):
        SuppliedChartInput(running_year=1, lagna_longitude=360)


def test_bsp_stays_disabled():
    chart = SuppliedChartInput(running_year=27, lagna_longitude=0,
        planetary_longitudes={"Mars": 10, "Jupiter": 20, "Saturn": 30})
    bsp = analyze_supplied_chart(chart)["bsp"]
    assert bsp["enabled_rule_count"] == 0 and bsp["triggered_rules"] == []
    assert len(bsp["research_candidates"]) == 5



def test_ayanamsha_is_caller_declared_not_verified():
    chart = SuppliedChartInput(running_year=1, lagna_longitude=0,
        ayanamsha="Lahiri", planetary_longitudes={"Moon": 60})
    result = analyze_supplied_chart(chart)
    assert "caller-declared; not independently verified" in result["ayanamsha"]
    assert any("Lahiri is caller-declared" in item for item in result["warnings"])


def test_unspecified_ayanamsha_does_not_claim_lahiri():
    chart = SuppliedChartInput(running_year=1, lagna_longitude=0,
        planetary_longitudes={"Moon": 60})
    result = analyze_supplied_chart(chart)
    assert result["ayanamsha"].startswith("unspecified")
    assert any("Ayanamsha was not specified" in item for item in result["warnings"])
