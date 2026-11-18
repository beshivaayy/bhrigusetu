import asyncio

import pytest
from fastapi import HTTPException

from app import ai_workspace


def test_gemini_workspace_requires_server_token(monkeypatch):
    monkeypatch.delenv("BHRIGUSETU_MCP_TOKEN", raising=False)
    with pytest.raises(HTTPException) as exc:
        asyncio.run(ai_workspace.gemini_workspace_consult(
            ai_workspace.GeminiConsultRequest(task="Connectivity check"),
            authorization="Bearer any-token",
        ))
    assert exc.value.status_code == 503


def test_gemini_workspace_rejects_invalid_token(monkeypatch):
    monkeypatch.setenv("BHRIGUSETU_MCP_TOKEN", "expected-secret")
    with pytest.raises(HTTPException) as exc:
        asyncio.run(ai_workspace.gemini_workspace_consult(
            ai_workspace.GeminiConsultRequest(task="Connectivity check"),
            authorization="Bearer wrong-secret",
        ))
    assert exc.value.status_code == 401


def test_gemini_workspace_calls_existing_consultation(monkeypatch):
    monkeypatch.setenv("BHRIGUSETU_MCP_TOKEN", "expected-secret")
    captured = {}

    async def fake_consult_gemini(**kwargs):
        captured.update(kwargs)
        return {"status": "ok", "model": "test-model", "text": "Gemini connection successful."}

    monkeypatch.setattr(ai_workspace, "consult_gemini", fake_consult_gemini)
    result = asyncio.run(ai_workspace.gemini_workspace_consult(
        ai_workspace.GeminiConsultRequest(
            task="Check connectivity",
            context="Workspace smoke test",
            model="test-model",
        ),
        authorization="Bearer expected-secret",
    ))

    assert result["status"] == "ok"
    assert result["text"] == "Gemini connection successful."
    assert captured == {
        "task": "Check connectivity",
        "context": "Workspace smoke test",
        "model": "test-model",
        "max_output_tokens": 2048,
    }


def test_gemini_workspace_rejects_blank_or_oversized_tasks():
    with pytest.raises(Exception):
        ai_workspace.GeminiConsultRequest(task="")
    with pytest.raises(Exception):
        ai_workspace.GeminiConsultRequest(task="x" * 20001)
