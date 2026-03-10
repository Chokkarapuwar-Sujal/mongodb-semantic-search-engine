from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_embed_success(monkeypatch) -> None:
    def _mock_generate_embedding(text: str) -> list[float]:
        return [0.1, 0.2, 0.3]

    monkeypatch.setattr("app.api.routes.generate_embedding", _mock_generate_embedding)
    response = client.post("/embed", json={"text": "hello world"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["dimensions"] == 3
    assert len(payload["embedding"]) == 3


def test_batch_embed_success(monkeypatch) -> None:
    def _mock_generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
        return [[0.1, 0.2], [0.3, 0.4]]

    monkeypatch.setattr("app.api.routes.generate_embeddings_batch", _mock_generate_embeddings_batch)
    response = client.post("/embed/batch", json={"texts": ["a", "b"]})

    assert response.status_code == 200
    payload = response.json()
    assert payload["dimensions"] == 2
    assert len(payload["embeddings"]) == 2
