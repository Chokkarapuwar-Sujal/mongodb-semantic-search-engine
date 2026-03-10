from app.services import embedding_service


class DummyModel:
    def encode(self, payload, normalize_embeddings=True):
        if isinstance(payload, str):
            return DummyVector([0.1, 0.2, 0.3])
        return DummyBatchVector([[0.1, 0.2], [0.3, 0.4]])


class DummyVector:
    def __init__(self, values):
        self.values = values

    def tolist(self):
        return self.values


class DummyBatchVector:
    def __init__(self, values):
        self.values = values

    def tolist(self):
        return self.values


def test_generate_embedding(monkeypatch):
    monkeypatch.setattr(embedding_service, "get_model", lambda: DummyModel())
    output = embedding_service.generate_embedding("semantic search")
    assert output == [0.1, 0.2, 0.3]


def test_generate_embeddings_batch(monkeypatch):
    monkeypatch.setattr(embedding_service, "get_model", lambda: DummyModel())
    output = embedding_service.generate_embeddings_batch(["a", "b"])
    assert output == [[0.1, 0.2], [0.3, 0.4]]
