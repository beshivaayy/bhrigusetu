import pytest
from app.rules.catalog import enabled_rules, load_catalog, validate_catalog

def test_catalog_is_valid_and_empty_until_sources_are_verified():
    catalog = load_catalog()
    assert catalog["method"] == "Bhrigu Saral Paddhati"
    assert len(catalog["rules"]) == 5
    assert {rule["id"] for rule in catalog["rules"]} == {
        "BSP-MARS-10TH-27",
        "BSP-MARS-KAKSHYA-27",
        "BSP-SATURN-3RD-ASPECT-20",
        "BSP-JUPITER-5TH-ASPECT-32",
        "BSP-JUPITER-9TH-ASPECT-40",
    }
    assert all(rule["verified"] is False for rule in catalog["rules"])
    assert all(rule["enabled"] is False for rule in catalog["rules"])
    assert enabled_rules() == []

def test_unverified_rule_cannot_be_enabled():
    rule = {
        "id": "TEST-01",
        "statement": "Test rule",
        "source_author": "Author",
        "source_title": "Source",
        "source_url": "https://example.com/source",
        "source_location": "Page 1",
        "preconditions": {"planet": "Mars"},
        "trigger": {"running_year": 1},
        "calculation": {"target_house_offset": 1},
        "confidence": "high",
        "validation_case": {"expected": "test"},
        "verified": False,
        "enabled": True,
    }
    with pytest.raises(ValueError, match="Unverified BSP rule cannot be enabled"):
        validate_catalog({"schema_version": 1, "rules": [rule]})

def test_enabled_rule_requires_source_and_validation_evidence():
    rule = {
        "id": "TEST-02", "statement": "Test rule", "source_author": "",
        "source_title": "", "source_url": "", "source_location": "",
        "preconditions": {}, "trigger": {}, "calculation": {},
        "confidence": "high", "validation_case": {},
        "verified": True, "enabled": True,
    }
    with pytest.raises(ValueError, match="lacks source or validation evidence"):
        validate_catalog({"schema_version": 1, "rules": [rule]})
