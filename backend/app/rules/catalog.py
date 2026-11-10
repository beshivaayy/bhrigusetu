"""Load and validate the source-controlled BSP rule catalog."""
from __future__ import annotations
import json
from pathlib import Path

CATALOG_PATH = Path(__file__).with_name("bsp_rules.json")
REQUIRED_FIELDS = {
    "id", "statement", "source_author", "source_title", "source_url",
    "source_location", "preconditions", "trigger", "calculation",
    "confidence", "validation_case", "verified", "enabled",
}

def validate_catalog(data: dict) -> dict:
    if data.get("schema_version") != 1 or not isinstance(data.get("rules"), list):
        raise ValueError("Invalid BSP rule catalog schema.")
    seen: set[str] = set()
    for rule in data["rules"]:
        missing = REQUIRED_FIELDS - set(rule)
        if missing:
            raise ValueError(f"BSP rule is missing required fields: {sorted(missing)}")
        if rule["id"] in seen:
            raise ValueError(f"Duplicate BSP rule ID: {rule['id']}")
        seen.add(rule["id"])
        if rule["enabled"] and not rule["verified"]:
            raise ValueError(f"Unverified BSP rule cannot be enabled: {rule['id']}")
        evidence = ("source_author", "source_title", "source_url", "source_location", "validation_case")
        if rule["enabled"] and not all(rule.get(key) for key in evidence):
            raise ValueError(f"Enabled BSP rule lacks source or validation evidence: {rule['id']}")
    return data

def load_catalog() -> dict:
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    return validate_catalog(data)

def enabled_rules() -> list[dict]:
    return [rule for rule in load_catalog()["rules"] if rule["verified"] and rule["enabled"]]
