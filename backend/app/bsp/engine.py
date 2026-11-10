"""BSP rule evaluation boundary."""
from ..rules import enabled_rules

def analyze_bsp(running_year: int, chart_data: dict | None = None) -> dict:
    rules = enabled_rules()
    return {
        "status": "research_pending" if not rules else "rules_loaded_matching_pending",
        "running_year": running_year,
        "triggered_rules": [],
        "enabled_rule_count": len(rules),
        "message": "No BSP production rules are enabled until source, conditions and validation cases are verified.",
    }
