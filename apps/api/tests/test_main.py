from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


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
