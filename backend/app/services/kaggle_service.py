"""Kaggle veri seti arama servisi.

Kaggle'ın genel REST API'sini (v1) doğrudan httpx ile çağırır; resmi `kaggle` pip
paketine ihtiyaç yoktur. Kimlik doğrulama HTTP Basic Auth ile yapılır
(kullanıcı adı: KAGGLE_USERNAME, şifre: KAGGLE_KEY — bkz. kaggle.com/settings > API).

Referans: https://www.kaggle.com/docs/api

NOT: KAGGLE_USERNAME/KAGGLE_KEY boş olduğu sürece gerçek bir API çağrısı yapılmaz;
KaggleServiceError fırlatılır.
"""

import logging

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.schemas.kaggle import KaggleDatasetSummary

logger = logging.getLogger(__name__)

KAGGLE_API_BASE_URL = "https://www.kaggle.com/api/v1"


class KaggleServiceError(RuntimeError):
    pass


def _ensure_credentials() -> tuple[str, str]:
    settings = get_settings()
    if not settings.kaggle_username or not settings.kaggle_key:
        raise KaggleServiceError(
            "KAGGLE_USERNAME / KAGGLE_KEY tanımlı değil. Lütfen .env dosyasına Kaggle API bilgilerinizi girin."
        )
    return settings.kaggle_username, settings.kaggle_key


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _list_datasets(username: str, key: str, query: str, page: int) -> list[dict]:
    response = httpx.get(
        f"{KAGGLE_API_BASE_URL}/datasets/list",
        params={"search": query, "page": page},
        auth=(username, key),
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()


def _to_summary(raw: dict, favorite_refs: set[str]) -> KaggleDatasetSummary:
    ref = raw.get("ref", "")
    return KaggleDatasetSummary(
        ref=ref,
        title=raw.get("title") or ref,
        subtitle=raw.get("subtitle") or None,
        url=raw.get("url") or f"https://www.kaggle.com/datasets/{ref}",
        owner_name=raw.get("ownerName"),
        vote_count=raw.get("voteCount"),
        download_count=raw.get("downloadCount"),
        last_updated=raw.get("lastUpdated"),
        is_favorite=ref in favorite_refs,
    )


def search_datasets(query: str, page: int = 1, favorite_refs: set[str] | None = None) -> list[KaggleDatasetSummary]:
    """Kaggle'da anahtar kelimeyle veri seti arar."""
    favorite_refs = favorite_refs or set()
    username, key = _ensure_credentials()
    raw_items = _list_datasets(username=username, key=key, query=query, page=page)
    logger.info("Kaggle araması: '%s' (sayfa %d) -> %d sonuç", query, page, len(raw_items))
    return [_to_summary(item, favorite_refs) for item in raw_items]
