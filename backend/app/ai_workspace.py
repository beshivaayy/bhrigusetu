"""Authenticated REST interface for the Gemini collaboration workspace."""

from __future__ import annotations

import os
import secrets

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from .gemini import consult_gemini

router = APIRouter(prefix="/api/ai", tags=["AI workspace"])


class GeminiConsultRequest(BaseModel):
    task: str = Field(min_length=1, max_length=20000)
    context: str = Field(default="", max_length=40000)
    model: str | None = Field(default=None, max_length=100)
    max_output_tokens: int = Field(default=2048, ge=128, le=8192)


@router.post("/gemini")
async def gemini_workspace_consult(
    payload: GeminiConsultRequest,
    authorization: str = Header(default=""),
) -> dict:
    """Send an explicit task/context to Gemini; protect the route with the existing MCP token."""
    expected = os.getenv("BHRIGUSETU_MCP_TOKEN", "").strip()
    if not expected:
        raise HTTPException(status_code=503, detail="AI workspace authentication is not configured.")
    scheme, _, supplied = authorization.partition(" ")
    if scheme.lower() != "bearer" or not supplied or not secrets.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="A valid BhriguSetu workspace token is required.")
    return await consult_gemini(
        task=payload.task,
        context=payload.context,
        model=payload.model,
        max_output_tokens=payload.max_output_tokens,
    )
