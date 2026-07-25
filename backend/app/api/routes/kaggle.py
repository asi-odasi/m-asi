from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import KaggleFavorite
from app.db.session import get_db
from app.schemas.kaggle import KaggleDatasetSummary, KaggleFavoriteUpdate, KaggleSearchResponse
from app.services.kaggle_service import search_datasets

router = APIRouter(prefix="/kaggle", tags=["kaggle"])


def _get_favorite_refs(db: Session) -> set[str]:
    return {row[0] for row in db.query(KaggleFavorite.DatasetRef).all()}


@router.get("/datasets", response_model=KaggleSearchResponse)
def list_kaggle_datasets(
    query: str | None = Query(None, description="Anahtar kelime, örn. 'Turkish disinformation'"),
    page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
) -> KaggleSearchResponse:
    """Kaggle'da anahtar kelimeyle dezenformasyon/fake news veri setlerini arar."""
    settings = get_settings()
    search_query = query or settings.kaggle_default_query
    favorite_refs = _get_favorite_refs(db)

    items = search_datasets(query=search_query, page=page, favorite_refs=favorite_refs)
    return KaggleSearchResponse(items=items, query=search_query, page=page)


@router.get("/favorites", response_model=list[KaggleDatasetSummary])
def list_kaggle_favorites(db: Session = Depends(get_db)) -> list[KaggleDatasetSummary]:
    """Yıldızlanmış Kaggle veri setlerini (DB'deki meta veri anlık görüntüsüyle) döner."""
    rows = db.query(KaggleFavorite).order_by(KaggleFavorite.CreatedAt.desc()).all()
    return [
        KaggleDatasetSummary(
            ref=row.DatasetRef,
            title=row.Title,
            subtitle=row.Subtitle,
            url=row.Url,
            owner_name=row.OwnerName,
            vote_count=row.VoteCount,
            download_count=row.DownloadCount,
            last_updated=row.LastUpdated,
            is_favorite=True,
        )
        for row in rows
    ]


@router.put("/favorites/{dataset_ref:path}")
def set_kaggle_favorite(
    dataset_ref: str, payload: KaggleFavoriteUpdate, db: Session = Depends(get_db)
) -> dict[str, str | bool]:
    """Bir Kaggle veri setini yıldızlar (meta veriyi anlık görüntü olarak kaydeder) / yıldızını kaldırır."""
    existing = db.get(KaggleFavorite, dataset_ref)

    if payload.isFavorite:
        if existing is None:
            db.add(
                KaggleFavorite(
                    DatasetRef=dataset_ref,
                    Title=payload.title or dataset_ref,
                    Subtitle=payload.subtitle,
                    Url=payload.url or f"https://www.kaggle.com/datasets/{dataset_ref}",
                    OwnerName=payload.ownerName,
                    VoteCount=payload.voteCount,
                    DownloadCount=payload.downloadCount,
                    LastUpdated=payload.lastUpdated,
                )
            )
            db.commit()
    elif existing is not None:
        db.delete(existing)
        db.commit()

    return {"ref": dataset_ref, "isFavorite": payload.isFavorite}
