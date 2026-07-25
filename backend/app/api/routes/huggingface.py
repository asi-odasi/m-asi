from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.models import BulletinFavorite
from app.db.session import get_db
from app.schemas.huggingface import BulletinFavoriteUpdate, BulletinPage
from app.services.huggingface_service import fetch_bulletins

router = APIRouter(prefix="/huggingface", tags=["huggingface"])


def _get_favorite_ids(db: Session) -> set[str]:
    return {row[0] for row in db.query(BulletinFavorite.BulletinId).all()}


@router.get("/bulletins", response_model=BulletinPage)
def list_bulletins(
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sort: Literal["newest", "oldest"] = Query("newest"),
    favoritesOnly: bool = Query(False),
    db: Session = Depends(get_db),
) -> BulletinPage:
    """İletişim Başkanlığı Dezenformasyon Bültenleri'ni (Hugging Face) sıralı/sayfalı döner."""
    favorite_ids = _get_favorite_ids(db)
    return fetch_bulletins(
        offset=offset,
        limit=limit,
        sort=sort,
        favorites_only=favoritesOnly,
        favorite_ids=favorite_ids,
    )


@router.put("/bulletins/{bulletin_id}/favorite")
def set_bulletin_favorite(
    bulletin_id: str, payload: BulletinFavoriteUpdate, db: Session = Depends(get_db)
) -> dict[str, str | bool]:
    """Bir Hugging Face bültenini yıldızlar / yıldızını kaldırır."""
    existing = db.get(BulletinFavorite, bulletin_id)

    if payload.isFavorite and existing is None:
        db.add(BulletinFavorite(BulletinId=bulletin_id))
        db.commit()
    elif not payload.isFavorite and existing is not None:
        db.delete(existing)
        db.commit()

    return {"id": bulletin_id, "isFavorite": payload.isFavorite}
