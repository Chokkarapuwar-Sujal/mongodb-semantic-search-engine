import logging
import os

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    BatchEmbeddingRequest,
    BatchEmbeddingResponse,
    EmbeddingRequest,
    EmbeddingResponse,
)
from app.services.embedding_service import generate_embedding, generate_embeddings_batch

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/embed", response_model=EmbeddingResponse)
def embed(request: EmbeddingRequest) -> EmbeddingResponse:
    try:
        embedding = generate_embedding(request.text)
        return EmbeddingResponse(
            embedding=embedding,
            model=os.getenv("MODEL_NAME", "all-MiniLM-L6-v2"),
            dimensions=len(embedding),
        )
    except Exception as exc:
        logger.exception("Embedding generation failed")
        raise HTTPException(status_code=500, detail="Embedding generation failed") from exc


@router.post("/embed/batch", response_model=BatchEmbeddingResponse)
def embed_batch(request: BatchEmbeddingRequest) -> BatchEmbeddingResponse:
    try:
        embeddings = generate_embeddings_batch(request.texts)
        dimensions = len(embeddings[0]) if embeddings else 0
        return BatchEmbeddingResponse(
            embeddings=embeddings,
            model=os.getenv("MODEL_NAME", "all-MiniLM-L6-v2"),
            dimensions=dimensions,
        )
    except Exception as exc:
        logger.exception("Batch embedding generation failed")
        raise HTTPException(status_code=500, detail="Batch embedding generation failed") from exc
