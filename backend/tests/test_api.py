from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_analysis_returns_partial_result_without_fake_chart():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2000-01-01",
        "time_of_birth": "09:40:00",
        "latitude": 22.17,
        "longitude": 75.58,
        "timezone": "Asia/Kolkata",
        "as_of_date": "2026-01-01",
    })
    assert response.status_code == 200
    payload = response.json()
    assert payload["running_year"] == 27
    assert payload["bcp"]["activated_house"] == 3
    assert payload["bcp"]["cycle"] == 3
    assert payload["bsp"]["triggered_rules"] == []
    assert payload["bsp"]["research_candidate_count"] == 5
    assert {rule["id"] for rule in payload["bsp"]["research_candidates"]} == {
        "BSP-MARS-10TH-27", "BSP-MARS-KAKSHYA-27",
        "BSP-SATURN-3RD-ASPECT-20", "BSP-JUPITER-5TH-ASPECT-32",
        "BSP-JUPITER-9TH-ASPECT-40",
    }
    assert all(rule["status"] == "disabled_pending_verification" for rule in payload["bsp"]["research_candidates"])
    assert payload["chart"]["status"] == "not_calculated"
    assert payload["birth_details"]["birth_datetime_local"] == "2000-01-01T09:40:00+05:30"
    assert payload["birth_details"]["birth_datetime_utc"] == "2000-01-01T04:10:00+00:00"

def test_invalid_timezone_is_rejected():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2000-01-01",
        "time_of_birth": "09:40:00",
        "latitude": 22.17,
        "longitude": 75.58,
        "timezone": "Not/A_Real_Zone",
    })
    assert response.status_code == 422

def test_analysis_date_before_birth_is_rejected():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2000-01-02",
        "time_of_birth": "09:40:00",
        "latitude": 22.17,
        "longitude": 75.58,
        "timezone": "Asia/Kolkata",
        "as_of_date": "2000-01-01",
    })
    assert response.status_code == 422

def test_rule_status_endpoint_reports_empty_verified_catalog():
    response = client.get("/api/rules/status")
    assert response.status_code == 200
    assert response.json()["total_rules"] == 1
    assert response.json()["enabled_rules"] == 0
    assert response.json()["status"] == "research_pending"

def test_ambiguous_dst_birth_time_requires_explicit_fold():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2024-11-03",
        "time_of_birth": "01:30:00",
        "latitude": 40.7,
        "longitude": -74.0,
        "timezone": "America/New_York",
    })
    assert response.status_code == 422
    assert "occurs twice" in str(response.json())

def test_ambiguous_dst_birth_time_accepts_explicit_fold():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2024-11-03",
        "time_of_birth": "01:30:00",
        "time_fold": 1,
        "latitude": 40.7,
        "longitude": -74.0,
        "timezone": "America/New_York",
        "as_of_date": "2024-11-03",
    })
    assert response.status_code == 200
    assert response.json()["birth_details"]["birth_datetime_utc"] == "2024-11-03T06:30:00+00:00"

def test_nonexistent_dst_birth_time_is_rejected():
    response = client.post("/api/analyze", json={
        "date_of_birth": "2024-03-10",
        "time_of_birth": "02:30:00",
        "latitude": 40.7,
        "longitude": -74.0,
        "timezone": "America/New_York",
    })
    assert response.status_code == 422
    assert "does not exist" in str(response.json())
