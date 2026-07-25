import datetime as dt

from pydantic import BaseModel, ConfigDict


class ArticleListItem(BaseModel):
    """Ana ekran liste görünümü için minimal alan seti."""

    model_config = ConfigDict(from_attributes=True)

    ArticleId: int
    Title: str
    Authors: list[str]
    PublishedDate: dt.datetime | None = None
    IsFavorite: bool = False


class ArticleDetail(BaseModel):
    """Detay görünümü için tüm alanlar."""

    model_config = ConfigDict(from_attributes=True)

    ArticleId: int
    ArxivId: str
    Title: str
    Authors: list[str]
    Abstract: str
    Categories: str | None = None
    PublishedDate: dt.datetime | None = None
    UpdatedDate: dt.datetime | None = None
    PdfUrl: str | None = None
    SimilarityScore: float | None = None
    IsFavorite: bool = False


class FavoriteUpdate(BaseModel):
    """PUT /articles/{id}/favorite gövdesi."""

    isFavorite: bool
