"""'Dezenformasyon' konseptini temsil eden referans (ankor) embedding vektörü.

REFERENCE_CONCEPTS (.env) içindeki her bir terim ayrı ayrı embed edilir ve
ortalaması alınarak tek bir konsept vektörü elde edilir. Süreç içinde tekrar tekrar
LLM çağrısı yapmamak için bir kez hesaplanıp bellekte önbelleğe alınır.
"""

import logging
from functools import lru_cache

import numpy as np

from app.core.config import get_settings
from app.pipeline.embedding_service import embed_texts

logger = logging.getLogger(__name__)


def _normalize(vector: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm


@lru_cache
def get_reference_vector() -> np.ndarray:
    """Referans kavramların ortalama, normalize edilmiş embedding vektörünü döner."""
    settings = get_settings()
    concepts = settings.reference_concepts_list

    logger.info("Referans konsept vektörü hesaplanıyor: %s", concepts)
    concept_vectors = embed_texts(concepts)
    mean_vector = concept_vectors.mean(axis=0)
    return _normalize(mean_vector)


def clear_cache() -> None:
    get_reference_vector.cache_clear()
