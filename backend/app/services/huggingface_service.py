"""Hugging Face Hub'daki İletişim Başkanlığı Dezenformasyon Bültenleri veri setine erişim.

Kaynak: https://huggingface.co/datasets/iletisim/dezenformasyon-bultenleri
Genel (public) bir dataset olduğu için kimlik doğrulama gerekmez.
HF datasets-server API'sinin /rows uç noktası tek istekte en fazla 100 satır kabul eder.

NOT: Veri setindeki `date_published` alanının çoğu kayıtta sabit bir tarih olduğu ve
satırların doğal sırasının kronolojik olmadığı gözlemlendi. Bu yüzden güvenilir bir
sıralama yapabilmek için tüm veri seti belleğe alınıp burada sıralanır/sayfalanır.
"""

import logging
import threading
import time
from concurrent.futures import ThreadPoolExecutor

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.schemas.huggingface import BulletinItem, BulletinPage

logger = logging.getLogger(__name__)

DATASETS_SERVER_BASE_URL = "https://datasets-server.huggingface.co"
MAX_ROWS_PER_REQUEST = 100
FETCH_CONCURRENCY = 8
CACHE_TTL_SECONDS = 3600

_cache_lock = threading.Lock()
_cache: dict[str, tuple[float, list[dict]]] = {}


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _get_total_rows() -> int:
    settings = get_settings()
    response = httpx.get(
        f"{DATASETS_SERVER_BASE_URL}/size",
        params={"dataset": settings.hf_dataset_id},
        timeout=20.0,
    )
    response.raise_for_status()
    return response.json()["size"]["dataset"]["num_rows"]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _get_rows(offset: int, length: int) -> list[dict]:
    settings = get_settings()
    response = httpx.get(
        f"{DATASETS_SERVER_BASE_URL}/rows",
        params={
            "dataset": settings.hf_dataset_id,
            "config": settings.hf_dataset_config,
            "split": settings.hf_dataset_split,
            "offset": offset,
            "length": length,
        },
        timeout=20.0,
    )
    response.raise_for_status()
    return [item["row"] for item in response.json()["rows"]]


def _fetch_all_rows() -> list[dict]:
    """Veri setinin tamamını (paralel isteklerle) çekip belleğe alır."""
    now = time.monotonic()

    with _cache_lock:
        cached = _cache.get("rows")
        if cached and now - cached[0] < CACHE_TTL_SECONDS:
            return cached[1]

        total = _get_total_rows()
        offsets = list(range(0, total, MAX_ROWS_PER_REQUEST))

        logger.info("Hugging Face veri seti belleğe alınıyor: %d satır, %d istek", total, len(offsets))
        with ThreadPoolExecutor(max_workers=FETCH_CONCURRENCY) as executor:
            batches = executor.map(lambda off: _get_rows(off, MAX_ROWS_PER_REQUEST), offsets)

        rows: list[dict] = []
        for batch in batches:
            rows.extend(batch)

        _cache["rows"] = (now, rows)
        logger.info("Hugging Face veri seti önbelleğe alındı: %d satır", len(rows))
        return rows


def fetch_bulletins(
    offset: int = 0,
    limit: int = 10,
    sort: str = "newest",
    favorites_only: bool = False,
    favorite_ids: set[str] | None = None,
) -> BulletinPage:
    """Bültenleri sıralayıp (isteğe bağlı yıldızlılarla filtreleyip) sayfalar."""
    favorite_ids = favorite_ids or set()
    rows = _fetch_all_rows()

    if favorites_only:
        rows = [r for r in rows if r["id"] in favorite_ids]

    rows = sorted(
        rows,
        key=lambda r: (r.get("date_published") or "", r.get("bulletin_number") or 0),
        reverse=(sort == "newest"),
    )

    total = len(rows)
    page_rows = rows[offset : offset + limit]

    items = [BulletinItem(**row, is_favorite=row["id"] in favorite_ids) for row in page_rows]
    return BulletinPage(items=items, total=total, offset=offset, limit=limit)
