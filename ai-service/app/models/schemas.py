from pydantic import BaseModel, Field


class EmbeddingRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class BatchEmbeddingRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=256)


class EmbeddingResponse(BaseModel):
    embedding: list[float]
    model: str
    dimensions: int


class BatchEmbeddingResponse(BaseModel):
    embeddings: list[list[float]]
    model: str
    dimensions: int
