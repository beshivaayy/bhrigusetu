from app.mcp_server import http_server


def test_http_transport_uses_render_port(monkeypatch):
    captured = {}
    monkeypatch.setenv("PORT", "12345")
    monkeypatch.setattr(http_server.mcp, "run", lambda **kwargs: captured.update(kwargs))

    http_server.main()

    assert captured == {
        "transport": "streamable-http",
        "host": "0.0.0.0",
        "port": 12345,
        "stateless_http": True,
        "json_response": True,
    }


def test_http_transport_has_local_port_fallback(monkeypatch):
    captured = {}
    monkeypatch.delenv("PORT", raising=False)
    monkeypatch.setattr(http_server.mcp, "run", lambda **kwargs: captured.update(kwargs))

    http_server.main()

    assert captured["port"] == 8000
