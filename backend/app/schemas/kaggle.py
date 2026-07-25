from pydantic import BaseModel


class KaggleDatasetSummary(BaseModel):
    """Kaggle arama sonucundaki tek bir veri setinin özet (metadata) bilgisi."""

    ref: str
    title: str
    subtitle: str | None = None
    url: str
    owner_name: str | None = None
    vote_count: int | None = None
    download_count: int | None = None
    last_updated: str | None = None
    is_favorite: bool = False


class KaggleSearchResponse(BaseModel):
    items: list[KaggleDatasetSummary]
    query: str
    page: int


class KaggleFavoriteUpdate(BaseModel):
    """PUT /kaggle/favorites/{ref} gövdesi.

    isFavorite=true iken title/url zorunlu kabul edilir (metadata anlık görüntüsü
    olarak DB'ye yazılır); isFavorite=false iken yalnızca kayıt silinir.
    """

    isFavorite: bool
    title: str | None = None
    subtitle: str | None = None
    url: str | None = None
    ownerName: str | None = None
    voteCount: int | None = None
    downloadCount: int | None = None
    lastUpdated: str | None = None
