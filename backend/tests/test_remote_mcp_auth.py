from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_remote_mcp_requires_bearer_token(monkeypatch):
    monkeypatch.setenv("BHRIGUSETU_MCP_TOKEN", "test-secret-token")
    response = client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}})
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"


def test_remote_mcp_rejects_missing_server_token_configuration(monkeypatch):
    monkeypatch.delenv("BHRIGUSETU_MCP_TOKEN", raising=False)
    response = client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}})
    assert response.status_code == 503


def test_remote_mcp_accepts_configured_bearer_token(monkeypatch):
    monkeypatch.setenv("BHRIGUSETU_MCP_TOKEN", "test-secret-token")
    with TestClient(app) as authenticated_client:
        response = authenticated_client.post(
            "/mcp",
            headers={"Authorization": "Bearer test-secret-token", "Accept": "application/json, text/event-stream"},
            json={
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "auth-test", "version": "1.0"}},
            },
        )
    assert response.status_code == 200


def test_health_remains_public_when_mcp_auth_is_enabled(monkeypatch):
    monkeypatch.setenv("BHRIGUSETU_MCP_TOKEN", "test-secret-token")
    response = client.get("/health")
    assert response.status_code == 200
