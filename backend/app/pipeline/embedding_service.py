"""Google Gemini embedding servisi.

API anahtarı `.env` dosyasındaki GEMINI_API_KEY değişkeninden okunur (bkz. app/core/config.py).
Resmi API referansı: https://ai.google.dev/gemini-api/docs/embeddings

NOT: GEMINI_API_KEY boş olduğu sürece gerçek bir API çağrısı yapılmaz; EmbeddingServiceError
fırlatılır. Bu, anahtar girilmeden pipeline'ın yanlışlıkla çalıştırılmasını engellemek içindir.
"""

import logging

import httpx
import numpy as np
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

logger = logging.getLogger(__name__)

GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
# Gemini batchEmbedContents tek istekte en fazla 100 içerik kabul eder.
MAX_BATCH_SIZE = 100


class EmbeddingServiceError(RuntimeError):
    pass


def _ensure_api_key_present() -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise EmbeddingServiceError(
            "GEMINI_API_KEY tanımlı değil. Lütfen .env dosyasına geçerli bir Gemini API anahtarı girin."
        )
    return settings.gemini_api_key


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _call_batch_embed(texts: list[str]) -> list[list[float]]:
    settings = get_settings()
    api_key = _ensure_api_key_present()

    model = settings.gemini_embedding_model
    url = f"{GEMINI_API_BASE_URL}/models/{model}:batchEmbedContents"

    payload = {
        "requests": [
            {
                "model": f"models/{model}",
                "content": {"parts": [{"text": text}]},
                "taskType": "SEMANTIC_SIMILARITY",
                "outputDimensionality": settings.embedding_dimensions,
            }
            for text in texts
        ]
    }

    # API anahtarı, istek URL'lerinin loglara açık metin olarak düşmemesi için
    # query parametresi yerine header ile gönderilir.
    headers = {"x-goog-api-key": api_key}
    response = httpx.post(url, headers=headers, json=payload, timeout=60.0)
    response.raise_for_status()
    data = response.json()

    return [item["values"] for item in data["embeddings"]]


def embed_texts(texts: list[str]) -> np.ndarray:
    """Bir liste metni embedding vektörlerine çevirir. Dönüş: (n, dim) şeklinde numpy array."""
    if not texts:
        return np.empty((0, 0), dtype=np.float32)

    vectors: list[list[float]] = []
    for i in range(0, len(texts), MAX_BATCH_SIZE):
        chunk = texts[i : i + MAX_BATCH_SIZE]
        vectors.extend(_call_batch_embed(chunk))

    return np.array(vectors, dtype=np.float32)


def embed_text(text: str) -> np.ndarray:
    """Tek bir metni embedding vektörüne çevirir. Dönüş: (dim,) şeklinde numpy array."""
    return embed_texts([text])[0]


def serialize_vector(vector: np.ndarray) -> bytes:
    """Vektörü MS SQL VARBINARY(MAX) kolonunda saklamak için bayt dizisine çevirir."""
    return vector.astype(np.float32).tobytes()


def deserialize_vector(data: bytes) -> np.ndarray:
    """VARBINARY(MAX) içinden okunan bayt dizisini tekrar numpy vektörüne çevirir."""
    return np.frombuffer(data, dtype=np.float32)
