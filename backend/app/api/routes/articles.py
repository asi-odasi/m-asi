from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Article, ArticleAuthor, Author
from app.db.session import get_db
from app.schemas.article import ArticleDetail, ArticleListItem, FavoriteUpdate

router = APIRouter(prefix="/articles", tags=["articles"])


def _get_authors(db: Session, article_id: int) -> list[str]:
    rows = (
        db.query(Author.FullName)
        .join(ArticleAuthor, ArticleAuthor.AuthorId == Author.AuthorId)
        .filter(ArticleAuthor.ArticleId == article_id)
        .order_by(ArticleAuthor.AuthorOrder)
        .all()
    )
    return [row[0] for row in rows]


@router.get("", response_model=list[ArticleListItem])
def list_articles(db: Session = Depends(get_db)) -> list[ArticleListItem]:
    """Ana ekran için: yalnızca filtreyi geçmiş (IsRelevant=1) makalelerin başlık + yazar listesi."""
    articles = (
        db.execute(
            select(Article).where(Article.IsRelevant == True).order_by(Article.PublishedDate.desc())  # noqa: E712
        )
        .scalars()
        .all()
    )

    return [
        ArticleListItem(
            ArticleId=a.ArticleId,
            Title=a.Title,
            Authors=_get_authors(db, a.ArticleId),
            PublishedDate=a.PublishedDate,
            IsFavorite=a.IsFavorite,
        )
        for a in articles
    ]


@router.get("/{article_id}", response_model=ArticleDetail)
def get_article(article_id: int, db: Session = Depends(get_db)) -> ArticleDetail:
    """Kullanıcı bir makaleye tıkladığında açılan detay görünümü için tam veri."""
    article = db.get(Article, article_id)
    if article is None or not article.IsRelevant:
        raise HTTPException(status_code=404, detail="Makale bulunamadı")

    return ArticleDetail(
        ArticleId=article.ArticleId,
        ArxivId=article.ArxivId,
        Title=article.Title,
        Authors=_get_authors(db, article.ArticleId),
        Abstract=article.Abstract,
        Categories=article.Categories,
        PublishedDate=article.PublishedDate,
        UpdatedDate=article.UpdatedDate,
        PdfUrl=article.PdfUrl,
        SimilarityScore=article.SimilarityScore,
        IsFavorite=article.IsFavorite,
    )


@router.put("/{article_id}/favorite", response_model=ArticleListItem)
def set_favorite(article_id: int, payload: FavoriteUpdate, db: Session = Depends(get_db)) -> ArticleListItem:
    """Bir makaleyi yıldızlar / yıldızını kaldırır."""
    article = db.get(Article, article_id)
    if article is None or not article.IsRelevant:
        raise HTTPException(status_code=404, detail="Makale bulunamadı")

    article.IsFavorite = payload.isFavorite
    db.commit()

    return ArticleListItem(
        ArticleId=article.ArticleId,
        Title=article.Title,
        Authors=_get_authors(db, article.ArticleId),
        PublishedDate=article.PublishedDate,
        IsFavorite=article.IsFavorite,
    )
