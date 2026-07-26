"""arXiv -> Gemini Embedding -> Benzerlik Filtresi -> PostgreSQL akışını orkestre eden ana pipeline job'u.

Çalıştırma:
    python -m app.pipeline.ingest_job
veya scripts/run_ingestion.py üzerinden.
"""

import datetime as dt
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.models import Article, ArticleAuthor, ArticleEmbedding, Author, IngestionRun
from app.db.session import SessionLocal
from app.pipeline.arxiv_fetcher import fetch_arxiv_papers
from app.pipeline.embedding_service import embed_text, serialize_vector
from app.pipeline.reference_vectors import get_reference_vector
from app.pipeline.similarity_filter import is_relevant

logger = logging.getLogger(__name__)


def _parse_iso_datetime(value: str | None) -> dt.datetime | None:
    if not value:
        return None
    return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))


def _get_or_create_author(db: Session, full_name: str) -> Author:
    author = db.query(Author).filter(Author.FullName == full_name).one_or_none()
    if author is None:
        author = Author(FullName=full_name)
        db.add(author)
        db.flush()
    return author


def _persist_article(
    db: Session, paper: dict[str, Any], score: float, vector_bytes: bytes, model_name: str, dim: int
) -> None:
    article = Article(
        ArxivId=paper["arxiv_id"],
        Title=paper["title"],
        Abstract=paper["summary"],
        Categories=",".join(paper["categories"]),
        PublishedDate=_parse_iso_datetime(paper["published"]),
        UpdatedDate=_parse_iso_datetime(paper["updated"]),
        PdfUrl=paper["pdf_url"],
        SimilarityScore=score,
        IsRelevant=True,
    )
    db.add(article)
    db.flush()

    for order, author_name in enumerate(paper["authors"]):
        author = _get_or_create_author(db, author_name)
        db.add(ArticleAuthor(ArticleId=article.ArticleId, AuthorId=author.AuthorId, AuthorOrder=order))

    db.add(
        ArticleEmbedding(
            ArticleId=article.ArticleId,
            ModelName=model_name,
            VectorDim=dim,
            VectorData=vector_bytes,
        )
    )


def run_ingestion() -> None:
    settings = get_settings()
    db = SessionLocal()
    run = IngestionRun(StartedAt=dt.datetime.utcnow(), Status="RUNNING")
    db.add(run)
    db.commit()
    db.refresh(run)

    fetched_count = 0
    filtered_count = 0

    try:
        reference_vector = get_reference_vector()
        papers = fetch_arxiv_papers(
            search_query=settings.arxiv_search_query,
            start=0,
            max_results=settings.arxiv_max_results,
        )
        fetched_count = len(papers)

        existing_ids = {row[0] for row in db.query(Article.ArxivId).all()}

        for paper in papers:
            if paper["arxiv_id"] in existing_ids:
                continue

            text_for_embedding = f"{paper['title']}\n\n{paper['summary']}"
            vector = embed_text(text_for_embedding)
            relevant, score = is_relevant(vector, reference_vector)

            if not relevant:
                continue

            _persist_article(
                db,
                paper,
                score=score,
                vector_bytes=serialize_vector(vector),
                model_name=settings.gemini_embedding_model,
                dim=vector.shape[0],
            )
            filtered_count += 1

        db.commit()

        run.FinishedAt = dt.datetime.utcnow()
        run.FetchedCount = fetched_count
        run.FilteredCount = filtered_count
        run.Status = "SUCCESS"
        db.commit()

        logger.info("Ingestion tamamlandı: %d çekildi, %d eşiği geçti", fetched_count, filtered_count)

    except Exception as exc:  # noqa: BLE001
        db.rollback()
        run.FinishedAt = dt.datetime.utcnow()
        run.FetchedCount = fetched_count
        run.FilteredCount = filtered_count
        run.Status = "FAILED"
        run.ErrorMessage = str(exc)
        db.commit()
        logger.exception("Ingestion başarısız oldu")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    configure_logging()
    run_ingestion()
