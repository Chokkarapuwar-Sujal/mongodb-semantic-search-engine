import logging
import os
from functools import lru_cache

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
    logger.info("Loading embedding model: %s", model_name)
    return SentenceTransformer(model_name)


def generate_embedding(text: str) -> list[float]:
    model = get_model()
    vector = model.encode(text, normalize_embeddings=True)
    return vector.tolist()


def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    model = get_model()
    vectors = model.encode(texts, normalize_embeddings=True)
    return vectors.tolist()
