from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Imaginarium Foundry API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"}


class WorkflowRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
    audience: str | None = None
    goal: str | None = None
    platforms: list[str] = Field(default_factory=lambda: ["youtube", "shorts"])


class WorkflowResponse(BaseModel):
    workflow: str
    status: str
    source: dict[str, Any]
    artifacts: dict[str, Any]
    quality: dict[str, Any]


def validate_youtube_url(value: str) -> bool:
    parsed = urlparse(value.strip())
    if parsed.scheme not in {"http", "https"}:
        return False
    host = parsed.netloc.lower().split(":")[0]
    if host not in YOUTUBE_HOSTS:
        return False
    if host == "youtu.be":
        return bool(parsed.path.strip("/"))
    return bool(parsed.query and re.search(r"(?:^|&)v=[^&]+", parsed.query)) or parsed.path.startswith("/shorts/")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "imaginarium-foundry-api"}


@app.post("/v1/workflows/youtube", response_model=WorkflowResponse)
def run_youtube_workflow(request: WorkflowRequest) -> WorkflowResponse:
    if not validate_youtube_url(request.url):
        raise HTTPException(status_code=422, detail="Provide a valid YouTube video URL.")

    return WorkflowResponse(
        workflow="youtube-content-intelligence",
        status="queued",
        source={"url": request.url, "audience": request.audience, "goal": request.goal},
        artifacts={
            "summary": None,
            "chapters": [],
            "clip_candidates": [],
            "hooks": [],
            "captions": [],
            "titles": [],
        },
        quality={
            "warnings": ["Prototype queue: transcription and AI providers are not connected yet."],
            "requires_review": True,
        },
    )
