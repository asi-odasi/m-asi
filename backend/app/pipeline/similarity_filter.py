"""Makale embedding'i ile referans konsept vektörü arasında kosinüs benzerliği hesabı."""

import numpy as np

from app.core.config import get_settings


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


def is_relevant(article_vector: np.ndarray, reference_vector: np.ndarray) -> tuple[bool, float]:
    """Makalenin eşik değerini geçip geçmediğini ve benzerlik skorunu döner."""
    settings = get_settings()
    score = cosine_similarity(article_vector, reference_vector)
    return score >= settings.similarity_threshold, score
