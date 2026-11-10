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
    assert payload["chart"]["status"] == "not_calculated"

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
    assert response.json()["total_rules"] == 0
    assert response.json()["enabled_rules"] == 0
    assert response.json()["status"] == "research_pending"
