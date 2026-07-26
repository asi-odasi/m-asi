# Railway Deploy Rehberi

m-asi, tek bir Railway projesi altında **backend + frontend + PostgreSQL** olarak deploy edilir:

| Servis | Kaynak | Root directory |
|---|---|---|
| `Postgres` | Railway'in native managed PostgreSQL eklentisi | — |
| `backend` | Bu repo (Dockerfile ile build) | `backend` |
| `frontend` | Bu repo (Nixpacks, Next.js otomatik algılanır) | `frontend` |

> Not: Proje başlangıçta MS SQL Server ile tasarlanmış ve MSSQL'i Railway'de özel bir Docker servisi olarak çalıştırmayı denemiştik. Railway'in Trial planındaki sabit kaynak limitleri (500MB disk, 1GB RAM) SQL Server için yetersiz kaldığı (disk dolması, OOM) için PostgreSQL'e geçildi — Railway'in native eklentisi bu limitlere rahatça sığıyor ve ayrıca yönetilmesi gereken özel bir Dockerfile/volume-izni derdi olmuyor.

## 1) `Postgres` eklentisi

1. Railway projesinde **New → Database → Add PostgreSQL** seç. Railway otomatik olarak bağlantı bilgilerini (`DATABASE_URL`, `PGHOST`, `PGPORT`, vb.) bu servisin **Variables** sekmesinde üretir — elle bir şey girmene gerek yok.

## 2) `backend` servisi

1. **New → GitHub Repo** ile bu repoyu bağla, **Root Directory** olarak `backend` seç (Railway, `backend/Dockerfile`'ı otomatik kullanır).
2. **Variables**:
   - `GEMINI_API_KEY=<key>`
   - `KAGGLE_USERNAME=<kullanıcı adı>`
   - `KAGGLE_KEY=<key>`
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (Railway'in "variable reference" özelliğiyle Postgres eklentisinin bağlantı stringini doğrudan referans veriyoruz — DB_SERVER/DB_PORT/DB_USER/DB_PASSWORD'ü tek tek elle kopyalamaya gerek yok, bu da kopyala-yapıştır hatalarını (örn. yanlış alana yanlış değer girme) ortadan kaldırıyor)
   - `CORS_ORIGINS=https://<frontend-servisinin-domaini>.up.railway.app`
3. **Settings → Networking → Generate Domain** ile public URL oluştur.
4. Deploy sonrası `https://<backend-domain>/health` adresi `{"status":"ok"}` dönmeli. İlk deploy'da `entrypoint.sh`, `scripts/init_db.py` çalıştırarak tabloları otomatik oluşturur.

## 3) `frontend` servisi

1. Aynı repo, **Root Directory** olarak `frontend` seç.
2. **Variables**:
   - `NEXT_PUBLIC_API_URL=https://<backend-domain>.up.railway.app`
3. **Settings → Networking → Generate Domain** ile public URL oluştur.

## Sıra önemli — "tavuk-yumurta" adımı

`CORS_ORIGINS` (backend) ve `NEXT_PUBLIC_API_URL` (frontend) birbirlerinin Railway domainine ihtiyaç duyar. Önerilen sıra:

1. `Postgres`, `backend`, `frontend` servislerini oluştur; `backend` ve `frontend` için domain üret (henüz `CORS_ORIGINS`/`NEXT_PUBLIC_API_URL`'i doğru girmeden).
2. Şimdi domainleri öğrendin — `CORS_ORIGINS` ve `NEXT_PUBLIC_API_URL` değişkenlerini gerçek domainlerle güncelle.
3. Backend ve frontend servislerini yeniden deploy et (env değişikliği otomatik redeploy tetikler).

## Doğrulama

- `backend` servis loglarında `Tablolar oluşturuldu (veya zaten mevcuttu).` mesajını gör.
- `https://<backend-domain>/health` → `{"status": "ok"}`.
- Frontend'i tarayıcıda aç, network sekmesinde backend'e giden isteklerde CORS hatası olmadığını doğrula.
