from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Imaginarium Foundry API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"}
JOBS: dict[str, dict[str, Any]] = {}


class WorkflowRequest(BaseModel):
    url: str = Field(..., description="YouTube video URL")
    audience: str | None = None
    goal: str | None = None
    platforms: list[str] = Field(default_factory=lambda: ["youtube", "shorts"])


class WorkflowResponse(BaseModel):
    job_id: str
    workflow: str
    status: str
    source: dict[str, Any]
    stages: list[dict[str, Any]]
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


def initial_stages() -> list[dict[str, Any]]:
    return [
        {"id": "ingest", "name": "Ingest video", "status": "queued"},
        {"id": "transcribe", "name": "Create transcript", "status": "blocked"},
        {"id": "analyze", "name": "Extract intelligence", "status": "blocked"},
        {"id": "repurpose", "name": "Generate clips and copy", "status": "blocked"},
        {"id": "review", "name": "Quality review", "status": "blocked"},
    ]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "imaginarium-foundry-api"}


@app.post("/v1/workflows/youtube", response_model=WorkflowResponse, status_code=202)
def run_youtube_workflow(request: WorkflowRequest) -> WorkflowResponse:
    if not validate_youtube_url(request.url):
        raise HTTPException(status_code=422, detail="Provide a valid YouTube video URL.")

    job_id = str(uuid4())
    job = WorkflowResponse(
        job_id=job_id,
        workflow="youtube-content-intelligence",
        status="queued",
        source={"url": request.url, "audience": request.audience, "goal": request.goal, "platforms": request.platforms},
        stages=initial_stages(),
        artifacts={"summary": None, "chapters": [], "clip_candidates": [], "hooks": [], "captions": [], "titles": []},
        quality={"warnings": ["Prototype mode: transcription and AI providers are not connected."], "requires_review": True},
    )
    JOBS[job_id] = job.model_dump()
    return job


@app.get("/v1/workflows/{job_id}", response_model=WorkflowResponse)
def get_workflow(job_id: str) -> WorkflowResponse:
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Workflow job not found.")
    return WorkflowResponse.model_validate(job)
