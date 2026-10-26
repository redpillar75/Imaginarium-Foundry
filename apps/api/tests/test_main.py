import pytest
from fastapi.testclient import TestClient
import app.main as main_module

from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def isolated_services(monkeypatch):
    """Exercise the actual job path without network calls or API charges."""
    main_module.JOBS.clear()
    monkeypatch.setattr(main_module, "fetch_transcript", lambda url: {"video_id": "example123", "text": "A sample transcript.", "segments": []})
    monkeypatch.setattr(main_module, "analyze_transcript", lambda text, audience, goal: {"summary": "Sample summary", "chapters": [], "clip_candidates": [], "hooks": [], "captions": [], "titles": []})
    yield
    main_module.JOBS.clear()



def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_youtube_workflow_accepts_youtube_url_and_can_be_retrieved() -> None:
    response = client.post(
        "/v1/workflows/youtube",
        json={"url": "https://www.youtube.com/watch?v=example123"},
    )
    assert response.status_code == 202
    payload = response.json()
    assert payload["status"] == "queued"
    assert payload["job_id"]

    retrieved = client.get(f"/v1/workflows/{payload['job_id']}")
    assert retrieved.status_code == 200
    assert retrieved.json()["job_id"] == payload["job_id"]


def test_youtube_workflow_rejects_non_youtube_url() -> None:
    response = client.post(
        "/v1/workflows/youtube",
        json={"url": "https://example.com/video"},
    )
    assert response.status_code == 422


def test_missing_workflow_returns_404() -> None:
    response = client.get("/v1/workflows/missing-job")
    assert response.status_code == 404

def test_completed_generation_keeps_human_review_pending():
    response = client.post("/v1/workflows/youtube", json={"url": "https://www.youtube.com/watch?v=example123"})
    job = client.get(f"/v1/workflows/{response.json()['job_id']}").json()
    assert job["status"] == "completed"
    assert job["artifacts"]["summary"] == "Sample summary"
    assert job["quality"]["requires_review"] is True
    assert next(stage for stage in job["stages"] if stage["id"] == "review")["status"] == "pending"


def test_transcript_failure_is_reported(monkeypatch):
    def unavailable(url):
        raise RuntimeError("Transcript unavailable")
    monkeypatch.setattr(main_module, "fetch_transcript", unavailable)
    response = client.post("/v1/workflows/youtube", json={"url": "https://www.youtube.com/watch?v=example123"})
    job = client.get(f"/v1/workflows/{response.json()['job_id']}").json()
    assert job["status"] == "failed"
    assert "Transcript unavailable" in job["quality"]["warnings"]
    assert next(stage for stage in job["stages"] if stage["id"] == "transcribe")["status"] == "failed"
