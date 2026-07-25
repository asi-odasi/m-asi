-- m-asi | MS SQL Server şema tanımı
-- Manuel kurulum veya referans için. SQLAlchemy modelleri (models.py) ile birebir eşleşir.

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'masi')
BEGIN
    CREATE DATABASE masi;
END
GO

USE masi;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Articles')
BEGIN
    CREATE TABLE Articles (
        ArticleId        BIGINT IDENTITY(1,1) PRIMARY KEY,
        ArxivId          NVARCHAR(50)   NOT NULL UNIQUE,
        Title            NVARCHAR(1000) NOT NULL,
        Abstract         NVARCHAR(MAX)  NOT NULL,
        Categories       NVARCHAR(200)  NULL,
        PublishedDate    DATETIME2      NULL,
        UpdatedDate      DATETIME2      NULL,
        PdfUrl           NVARCHAR(500)  NULL,
        SimilarityScore  FLOAT          NULL,
        IsRelevant       BIT            NOT NULL DEFAULT 0,
        IsFavorite       BIT            NOT NULL DEFAULT 0,
        CreatedAt        DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- Var olan kurulumlarda tabloyu bozmadan kolonu ekler (migration).
IF NOT EXISTS (
    SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Articles') AND name = 'IsFavorite'
)
BEGIN
    ALTER TABLE Articles ADD IsFavorite BIT NOT NULL DEFAULT 0;
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Authors')
BEGIN
    CREATE TABLE Authors (
        AuthorId   INT IDENTITY(1,1) PRIMARY KEY,
        FullName   NVARCHAR(300) NOT NULL UNIQUE
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ArticleAuthors')
BEGIN
    CREATE TABLE ArticleAuthors (
        ArticleId   BIGINT NOT NULL FOREIGN KEY REFERENCES Articles(ArticleId),
        AuthorId    INT    NOT NULL FOREIGN KEY REFERENCES Authors(AuthorId),
        AuthorOrder SMALLINT NOT NULL,
        PRIMARY KEY (ArticleId, AuthorId)
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ArticleEmbeddings')
BEGIN
    CREATE TABLE ArticleEmbeddings (
        EmbeddingId  BIGINT IDENTITY(1,1) PRIMARY KEY,
        ArticleId    BIGINT NOT NULL FOREIGN KEY REFERENCES Articles(ArticleId),
        ModelName    NVARCHAR(100) NOT NULL,
        VectorDim    INT NOT NULL,
        VectorData   VARBINARY(MAX) NOT NULL,
        CreatedAt    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BulletinFavorites')
BEGIN
    -- Hugging Face bültenleri dış kaynaklı olduğu için ID'leriyle burada yıldızlanır.
    CREATE TABLE BulletinFavorites (
        BulletinId NVARCHAR(100) PRIMARY KEY,
        CreatedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IngestionRuns')
BEGIN
    CREATE TABLE IngestionRuns (
        RunId         BIGINT IDENTITY(1,1) PRIMARY KEY,
        StartedAt     DATETIME2 NOT NULL,
        FinishedAt    DATETIME2 NULL,
        FetchedCount  INT NOT NULL DEFAULT 0,
        FilteredCount INT NOT NULL DEFAULT 0,
        Status        NVARCHAR(20) NOT NULL,
        ErrorMessage  NVARCHAR(MAX) NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Articles_IsRelevant')
BEGIN
    CREATE INDEX IX_Articles_IsRelevant ON Articles(IsRelevant, PublishedDate DESC);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Articles_SimilarityScore')
BEGIN
    CREATE INDEX IX_Articles_SimilarityScore ON Articles(SimilarityScore DESC);
END
GO
