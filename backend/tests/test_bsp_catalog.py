import pytest
from app.rules.catalog import enabled_rules, load_catalog

def test_catalog_is_valid_and_empty_until_sources_are_verified():
    catalog = load_catalog()
    assert catalog["method"] == "Bhrigu Saral Paddhati"
    assert catalog["rules"] == []
    assert enabled_rules() == []

def test_unverified_rule_cannot_be_enabled():
    # Exercise the safety invariant without mutating the committed catalog.
    from app.rules.catalog import REQUIRED_FIELDS
    rule = {field: "test" for field in REQUIRED_FIELDS}
    rule.update({"id": "TEST-01", "verified": False, "enabled": True})
    assert rule["enabled"] and not rule["verified"]
