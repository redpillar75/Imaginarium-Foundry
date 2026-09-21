from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_youtube_workflow_accepts_youtube_url() -> None:
    response = client.post(
        "/v1/workflows/youtube",
        json={"url": "https://www.youtube.com/watch?v=example123"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "queued"


def test_youtube_workflow_rejects_non_youtube_url() -> None:
    response = client.post(
        "/v1/workflows/youtube",
        json={"url": "https://example.com/video"},
    )
    assert response.status_code == 422
