# Mimari

## Akış

1. **arxiv_fetcher** — arXiv e-Print API'sinden (`cs.CL`, `cs.SI`, `cs.CY` kategorileri) en güncel makaleleri çeker.
2. **reference_vectors** — "disinformation", "fake news", "misinformation", "propaganda" gibi çekirdek kavramların ortalama embedding'inden tek bir referans (ankor) vektör üretir.
3. **embedding_service** — Her makalenin başlık+özetini `.env` içindeki `LLM_API_KEY` ile bir embedding modeline gönderip vektöre çevirir.
4. **similarity_filter** — Makale vektörü ile referans vektör arasında kosinüs benzerliği hesaplar; `SIMILARITY_THRESHOLD` üzerindeki makaleler kabul edilir.
5. **ingest_job** — Yukarıdaki adımları orkestre eder, kabul edilen makaleleri MS SQL'e yazar, her çalıştırmayı `IngestionRuns` tablosuna loglar.
6. **FastAPI** — Sadece `IsRelevant = 1` olan makaleleri `/articles` (liste: başlık+yazar) ve `/articles/{id}` (detay) uçlarından sunar.
7. **Next.js** — Ana ekranda liste, tıklanınca modal/detay sayfasında tam içerik gösterir.

## Veritabanı Şeması

Bkz. `backend/app/db/schema.sql` (DDL) ve `backend/app/db/models.py` (SQLAlchemy ORM).

- `Articles` — başlık, özet, kategori, tarihler, PDF linki, benzerlik skoru, `IsRelevant` bayrağı.
- `Authors` / `ArticleAuthors` — normalize edilmiş yazar ilişkisi (many-to-many).
- `ArticleEmbeddings` — embedding vektörleri (`VARBINARY(MAX)`, float32 serileştirilmiş).
- `IngestionRuns` — her pipeline çalıştırmasının izlenebilirlik kaydı.

## Vektör Saklama Notu

Standart MS SQL Server'da native vektör tipi yoktur (SQL Server 2025 / Azure SQL'de preview `VECTOR` tipi mevcut). Bu yüzden vektörler `VARBINARY(MAX)` olarak saklanır, benzerlik hesabı pipeline (Python/numpy) tarafında yapılır. SQL Server sürümünüz native `VECTOR` destekliyorsa `ArticleEmbeddings.VectorData` kolonu `VECTOR(n)` tipine ve hesaplama `VECTOR_DISTANCE()` fonksiyonuna taşınabilir.
