import datetime as dt

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    LargeBinary,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Article(Base):
    __tablename__ = "Articles"

    ArticleId: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    ArxivId: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    Title: Mapped[str] = mapped_column(String(1000), nullable=False)
    Abstract: Mapped[str] = mapped_column(Text, nullable=False)
    Categories: Mapped[str | None] = mapped_column(String(200), nullable=True)
    PublishedDate: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    UpdatedDate: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    PdfUrl: Mapped[str | None] = mapped_column(String(500), nullable=True)
    SimilarityScore: Mapped[float | None] = mapped_column(Float, nullable=True)
    IsRelevant: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    IsFavorite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    CreatedAt: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    author_links: Mapped[list["ArticleAuthor"]] = relationship(back_populates="article")
    embeddings: Mapped[list["ArticleEmbedding"]] = relationship(back_populates="article")


class Author(Base):
    __tablename__ = "Authors"

    AuthorId: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    FullName: Mapped[str] = mapped_column(String(300), unique=True, nullable=False)

    article_links: Mapped[list["ArticleAuthor"]] = relationship(back_populates="author")


class ArticleAuthor(Base):
    __tablename__ = "ArticleAuthors"

    ArticleId: Mapped[int] = mapped_column(BigInteger, ForeignKey("Articles.ArticleId"), primary_key=True)
    AuthorId: Mapped[int] = mapped_column(Integer, ForeignKey("Authors.AuthorId"), primary_key=True)
    AuthorOrder: Mapped[int] = mapped_column(SmallInteger, nullable=False)

    article: Mapped["Article"] = relationship(back_populates="author_links")
    author: Mapped["Author"] = relationship(back_populates="article_links")


class ArticleEmbedding(Base):
    __tablename__ = "ArticleEmbeddings"

    EmbeddingId: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    ArticleId: Mapped[int] = mapped_column(BigInteger, ForeignKey("Articles.ArticleId"), nullable=False)
    ModelName: Mapped[str] = mapped_column(String(100), nullable=False)
    VectorDim: Mapped[int] = mapped_column(Integer, nullable=False)
    VectorData: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    CreatedAt: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    article: Mapped["Article"] = relationship(back_populates="embeddings")


class BulletinFavorite(Base):
    """Hugging Face bültenleri, dış kaynaklı olduğu için ID'leriyle burada yıldızlanır."""

    __tablename__ = "BulletinFavorites"

    BulletinId: Mapped[str] = mapped_column(String(100), primary_key=True)
    CreatedAt: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)


class KaggleFavorite(Base):
    """Kaggle veri seti arama sonuçları canlı/dinamik olduğu için burada yalnızca
    kullanıcının yıldızladığı veri setlerinin meta verisi anlık görüntü olarak saklanır."""

    __tablename__ = "KaggleFavorites"

    DatasetRef: Mapped[str] = mapped_column(String(300), primary_key=True)
    Title: Mapped[str] = mapped_column(String(500), nullable=False)
    Subtitle: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    Url: Mapped[str] = mapped_column(String(500), nullable=False)
    OwnerName: Mapped[str | None] = mapped_column(String(200), nullable=True)
    VoteCount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    DownloadCount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    LastUpdated: Mapped[str | None] = mapped_column(String(50), nullable=True)
    CreatedAt: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)


class IngestionRun(Base):
    __tablename__ = "IngestionRuns"
    __table_args__ = (UniqueConstraint("RunId"),)

    RunId: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    StartedAt: Mapped[dt.datetime] = mapped_column(DateTime, nullable=False)
    FinishedAt: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    FetchedCount: Mapped[int] = mapped_column(Integer, default=0)
    FilteredCount: Mapped[int] = mapped_column(Integer, default=0)
    Status: Mapped[str] = mapped_column(String(20), nullable=False)
    ErrorMessage: Mapped[str | None] = mapped_column(Text, nullable=True)
