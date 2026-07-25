"""arXiv e-Print API'sinden 'disinformation' odaklı makaleleri çeken servis.

Referans: https://info.arxiv.org/help/api/user-manual.html

Kritik kural: arXiv, API'nin kaba kullanımını (aşırı sıklıkta istek) yasaklar
(bkz. https://info.arxiv.org/help/api/tos.html). Bu modül, art arda yapılan
istekler arasında en az MIN_REQUEST_INTERVAL_SECONDS (3000ms) beklenmesini
garanti eder.
"""

import logging
import time
from typing import Any
from xml.etree import ElementTree

import httpx

logger = logging.getLogger(__name__)

ARXIV_API_URL = "https://export.arxiv.org/api/query"
MIN_REQUEST_INTERVAL_SECONDS = 3.0

ATOM_NS = "{http://www.w3.org/2005/Atom}"

_last_request_at: float | None = None


def _respect_rate_limit() -> None:
    """İki istek arasında en az MIN_REQUEST_INTERVAL_SECONDS geçmesini garanti eder."""
    global _last_request_at

    if _last_request_at is not None:
        elapsed = time.monotonic() - _last_request_at
        remaining = MIN_REQUEST_INTERVAL_SECONDS - elapsed
        if remaining > 0:
            logger.info("Rate limit: %.2f saniye bekleniyor", remaining)
            time.sleep(remaining)

    _last_request_at = time.monotonic()


def _entry_to_dict(entry: ElementTree.Element) -> dict[str, Any]:
    arxiv_id_full = entry.findtext(f"{ATOM_NS}id", default="") or ""

    pdf_url = None
    for link in entry.findall(f"{ATOM_NS}link"):
        if link.get("title") == "pdf":
            pdf_url = link.get("href")
            break

    return {
        "arxiv_id": arxiv_id_full.rsplit("/", 1)[-1],
        "title": (entry.findtext(f"{ATOM_NS}title", default="") or "").strip().replace("\n", " "),
        "summary": (entry.findtext(f"{ATOM_NS}summary", default="") or "").strip().replace("\n", " "),
        "authors": [
            (author.findtext(f"{ATOM_NS}name", default="") or "").strip()
            for author in entry.findall(f"{ATOM_NS}author")
        ],
        "categories": [
            cat.get("term", "") for cat in entry.findall(f"{ATOM_NS}category") if cat.get("term")
        ],
        "published": entry.findtext(f"{ATOM_NS}published"),
        "updated": entry.findtext(f"{ATOM_NS}updated"),
        "pdf_url": pdf_url,
    }


def _parse_atom_xml(xml_text: str) -> list[dict[str, Any]]:
    """arXiv'in Atom/XML yanıtını JSON'a çevrilebilir (dict listesi) bir yapıya parse eder."""
    root = ElementTree.fromstring(xml_text)
    return [_entry_to_dict(entry) for entry in root.findall(f"{ATOM_NS}entry")]


def fetch_arxiv_papers(
    search_query: str = "all:disinformation",
    start: int = 0,
    max_results: int = 50,
) -> list[dict[str, Any]]:
    """arXiv'den makaleleri çekip JSON'a çevrilebilir dict listesi olarak döner.

    Örnek: fetch_arxiv_papers("all:disinformation", start=0, max_results=50)
    -> http://export.arxiv.org/api/query?search_query=all:disinformation&start=0&max_results=50
    """
    _respect_rate_limit()

    params = {"search_query": search_query, "start": start, "max_results": max_results}
    logger.info("arXiv isteği gönderiliyor: %s", params)

    response = httpx.get(ARXIV_API_URL, params=params, timeout=30.0, follow_redirects=True)
    response.raise_for_status()

    papers = _parse_atom_xml(response.text)
    logger.info("arXiv'den %d makale çekildi", len(papers))
    return papers


if __name__ == "__main__":
    import json

    logging.basicConfig(level=logging.INFO)
    results = fetch_arxiv_papers()
    print(json.dumps(results, ensure_ascii=False, indent=2))
