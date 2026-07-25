from pydantic import BaseModel


class BulletinItem(BaseModel):
    """İletişim Başkanlığı Dezenformasyon Bültenleri veri setindeki tek bir ClaimReview kaydı."""

    id: str
    bulletin_number: int | None = None
    date_published: str | None = None
    claim: str
    fact_check: str
    rating_value: str | None = None
    rating_label: str | None = None
    claim_url: str | None = None
    source_url: str | None = None
    author: str | None = None
    is_favorite: bool = False


class BulletinPage(BaseModel):
    """Sayfalanmış bülten listesi yanıtı."""

    items: list[BulletinItem]
    total: int
    offset: int
    limit: int


class BulletinFavoriteUpdate(BaseModel):
    """PUT /huggingface/bulletins/{id}/favorite gövdesi."""

    isFavorite: bool
