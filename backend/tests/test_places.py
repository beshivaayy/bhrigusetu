import pytest
from fastapi.testclient import TestClient
from app import places
from app.main import app

client = TestClient(app)

class FakeResponse:
    def raise_for_status(self):
        return None

    def json(self):
        return [{
            "place_id": 123,
            "display_name": "Maheshwar, Madhya Pradesh, India",
            "lat": "22.176",
            "lon": "75.587",
            "osm_type": "relation",
            "osm_id": 456,
        }]

class FakeAsyncClient:
    calls = 0

    def __init__(self, *args, **kwargs):
        self.headers = kwargs.get("headers", {})

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return None

    async def get(self, url, params):
        type(self).calls += 1
        assert "BhriguSetu/" in self.headers["User-Agent"]
        assert params["format"] == "jsonv2"
        assert params["limit"] == 5
        return FakeResponse()

def test_place_search_returns_coordinates_and_timezone(monkeypatch):
    places._cache.clear()
    monkeypatch.setattr(places.httpx, "AsyncClient", FakeAsyncClient)
    monkeypatch.setattr(places, "timezones_at", lambda lng, lat: ["Asia/Kolkata"])
    monkeypatch.setattr(places, "_last_request_at", 0.0)
    result = client.get("/api/places/search", params={"q": "Maheshwar, Madhya Pradesh"})
    assert result.status_code == 200
    payload = result.json()
    assert payload["results"][0]["latitude"] == 22.176
    assert payload["results"][0]["longitude"] == 75.587
    assert payload["results"][0]["timezone"] == "Asia/Kolkata"
    assert payload["results"][0]["timezone_candidates"] == ["Asia/Kolkata"]
    assert "OpenStreetMap" in payload["attribution"]
    again = client.get("/api/places/search", params={"q": "  Maheshwar,   Madhya Pradesh "})
    assert again.status_code == 200
    assert FakeAsyncClient.calls == 1

def test_place_search_rejects_short_query():
    response = client.get("/api/places/search", params={"q": "MP"})
    assert response.status_code == 422

def test_timezone_lookup_is_offline_and_deterministic():
    from timezonefinder import timezones_at
    assert "Asia/Kolkata" in timezones_at(lng=75.587, lat=22.176)

def test_timezone_border_is_not_silently_guessed(monkeypatch):
    places._cache.clear()
    monkeypatch.setattr(places.httpx, "AsyncClient", FakeAsyncClient)
    monkeypatch.setattr(places, "timezones_at", lambda lng, lat: ["Europe/Paris", "Europe/Madrid"])
    monkeypatch.setattr(places, "_last_request_at", 0.0)
    response = client.get("/api/places/search", params={"q": "Border test location"})
    assert response.status_code == 200
    result = response.json()["results"][0]
    assert result["timezone"] is None
    assert result["timezone_candidates"] == ["Europe/Paris", "Europe/Madrid"]
