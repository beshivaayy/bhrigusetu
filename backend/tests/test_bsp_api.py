from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_bsp_catalog_exposes_research_rules_without_enabling_them():
    response = client.get("/api/bsp/catalog")
    assert response.status_code == 200
    payload = response.json()
    assert payload["method"] == "Bhrigu Saral Paddhati"
    assert payload["total_rules"] == 5
    assert payload["enabled_rules"] == 0
    assert payload["status"] == "research_pending"
    assert all(rule["verified"] is False and rule["enabled"] is False for rule in payload["rules"])
    assert len(payload["kakshya"]["slots"]) == 8


def test_bsp_kakshya_endpoint_returns_expected_slot_and_boundary_policy():
    response = client.get("/api/bsp/kakshya", params={"degree_in_sign": 15})
    assert response.status_code == 200
    payload = response.json()
    assert payload["index"] == 5
    assert payload["lord"] == "Venus"
    assert payload["start_degree"] == 15
    assert payload["end_degree"] == 18.75
    assert payload["boundary_policy"] == "start_inclusive_end_exclusive"


def test_bsp_kakshya_endpoint_rejects_degree_outside_sign():
    assert client.get("/api/bsp/kakshya", params={"degree_in_sign": 30}).status_code == 422
    assert client.get("/api/bsp/kakshya", params={"degree_in_sign": -0.1}).status_code == 422


def test_bsp_same_degree_endpoint_uses_whole_degree_convention():
    response = client.get("/api/bsp/same-degree", params={
        "first_degree": 27 + 14 / 60,
        "second_degree": 27 + 50 / 60,
    })
    assert response.status_code == 200
    payload = response.json()
    assert payload["same_degree_number"] is True
    assert payload["comparison"] == "integer_degree_within_sign"
    assert payload["status"] == "source_transcribed_utility_not_prediction"


def test_bsp_same_degree_endpoint_does_not_match_adjacent_integer_degrees():
    response = client.get("/api/bsp/same-degree", params={
        "first_degree": 26 + 59 / 60,
        "second_degree": 27,
    })
    assert response.status_code == 200
    assert response.json()["same_degree_number"] is False
}
