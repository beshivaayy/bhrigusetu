"""BSP rule evaluation boundary with visible disabled research candidates."""
from ..rules import load_catalog, enabled_rules

def analyze_bsp(running_year: int, chart_data: dict | None = None) -> dict:
    catalog = load_catalog()
    all_rules = catalog["rules"]
    active_rules = enabled_rules()
    candidates = [
        {
            "id": rule["id"],
            "statement": rule["statement"],
            "source_title": rule["source_title"],
            "source_url": rule["source_url"],
            "source_location": rule["source_location"],
            "confidence": rule["confidence"],
            "status": "disabled_pending_verification",
        }
        for rule in all_rules
        if not (rule["verified"] and rule["enabled"])
    ]
    # Matching is deliberately withheld until rule preconditions and
    # deterministic calculation semantics have been independently validated.
    return {
        "status": "research_pending" if not active_rules else "rules_loaded_matching_pending",
        "running_year": running_year,
        "triggered_rules": [],
        "enabled_rule_count": len(active_rules),
        "research_candidate_count": len(candidates),
        "research_candidates": candidates,
        "message": "Research candidates are shown for transparency only. No BSP production rules are enabled.",
    }
