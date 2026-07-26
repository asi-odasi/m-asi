-- m-asi | PostgreSQL şema tanımı
-- Manuel kurulum veya referans için. SQLAlchemy modelleri (models.py) ile birebir eşleşir.
-- Uygulama bu dosyayı otomatik çalıştırmaz; tablolar scripts/init_db.py (Base.metadata.create_all) ile oluşturulur.

CREATE TABLE IF NOT EXISTS "Articles" (
    "ArticleId"       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "ArxivId"         VARCHAR(50)   NOT NULL UNIQUE,
    "Title"           VARCHAR(1000) NOT NULL,
    "Abstract"        TEXT          NOT NULL,
    "Categories"      VARCHAR(200)  NULL,
    "PublishedDate"   TIMESTAMP     NULL,
    "UpdatedDate"     TIMESTAMP     NULL,
    "PdfUrl"          VARCHAR(500)  NULL,
    "SimilarityScore" DOUBLE PRECISION NULL,
    "IsRelevant"      BOOLEAN       NOT NULL DEFAULT FALSE,
    "IsFavorite"      BOOLEAN       NOT NULL DEFAULT FALSE,
    "CreatedAt"       TIMESTAMP     NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS "Authors" (
    "AuthorId" SERIAL PRIMARY KEY,
    "FullName" VARCHAR(300) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "ArticleAuthors" (
    "ArticleId"   BIGINT   NOT NULL REFERENCES "Articles"("ArticleId"),
    "AuthorId"    INTEGER  NOT NULL REFERENCES "Authors"("AuthorId"),
    "AuthorOrder" SMALLINT NOT NULL,
    PRIMARY KEY ("ArticleId", "AuthorId")
);

CREATE TABLE IF NOT EXISTS "ArticleEmbeddings" (
    "EmbeddingId" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "ArticleId"   BIGINT NOT NULL REFERENCES "Articles"("ArticleId"),
    "ModelName"   VARCHAR(100) NOT NULL,
    "VectorDim"   INTEGER NOT NULL,
    "VectorData"  BYTEA NOT NULL,
    "CreatedAt"   TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Hugging Face bültenleri dış kaynaklı olduğu için ID'leriyle burada yıldızlanır.
CREATE TABLE IF NOT EXISTS "BulletinFavorites" (
    "BulletinId" VARCHAR(100) PRIMARY KEY,
    "CreatedAt"  TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Kaggle arama sonuçları canlı/dinamik olduğu için burada yalnızca yıldızlanan
-- veri setlerinin meta verisi (yıldızlama anındaki hâliyle) saklanır.
CREATE TABLE IF NOT EXISTS "KaggleFavorites" (
    "DatasetRef"    VARCHAR(300) PRIMARY KEY,
    "Title"         VARCHAR(500) NOT NULL,
    "Subtitle"      VARCHAR(1000) NULL,
    "Url"           VARCHAR(500) NOT NULL,
    "OwnerName"     VARCHAR(200) NULL,
    "VoteCount"     INTEGER NULL,
    "DownloadCount" INTEGER NULL,
    "LastUpdated"   VARCHAR(50) NULL,
    "CreatedAt"     TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS "IngestionRuns" (
    "RunId"         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "StartedAt"     TIMESTAMP NOT NULL,
    "FinishedAt"    TIMESTAMP NULL,
    "FetchedCount"  INTEGER NOT NULL DEFAULT 0,
    "FilteredCount" INTEGER NOT NULL DEFAULT 0,
    "Status"        VARCHAR(20) NOT NULL,
    "ErrorMessage"  TEXT NULL
);

CREATE INDEX IF NOT EXISTS "IX_Articles_IsRelevant" ON "Articles"("IsRelevant", "PublishedDate" DESC);

CREATE INDEX IF NOT EXISTS "IX_Articles_SimilarityScore" ON "Articles"("SimilarityScore" DESC);
