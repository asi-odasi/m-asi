# Railway Deploy Rehberi

m-asi, tek bir Railway projesi altında **3 ayrı servis** olarak deploy edilir:

| Servis | Kaynak | Root directory |
|---|---|---|
| `mssql` | Docker Image: `mcr.microsoft.com/mssql/server:2022-latest` | — |
| `backend` | Bu repo (Dockerfile ile build) | `backend` |
| `frontend` | Bu repo (Nixpacks, Next.js otomatik algılanır) | `frontend` |

Railway'de MS SQL Server için yerleşik (managed) bir eklenti yok, bu yüzden resmi Docker imajı ayrı bir servis olarak çalıştırılıyor.

## 1) `mssql` servisi

1. Railway projesinde **New → Deploy from Docker Image** seçip `mcr.microsoft.com/mssql/server:2022-latest` gir.
2. **Variables**:
   - `ACCEPT_EULA=Y`
   - `MSSQL_SA_PASSWORD=<güçlü bir şifre>`
   - `MSSQL_PID=Developer`
3. **Volume** ekle, mount path: `/var/opt/mssql` (aksi halde her redeploy'da veriler silinir).
4. Bu servise **public domain oluşturma** — backend zaten private network üzerinden erişecek.

> ⚠️ `Developer` edition ücretsizdir ama üretimde (production/ticari) kullanım için lisanslı değildir. Gerçek kullanıcı verisiyle canlıya çıkacaksanız Microsoft'un lisans şartlarını kontrol edin veya Azure SQL gibi lisanslı bir üretim ortamına geçmeyi değerlendirin.

## 2) `backend` servisi

1. **New → GitHub Repo** ile bu repoyu bağla, **Root Directory** olarak `backend` seç (Railway, `backend/Dockerfile`'ı otomatik kullanır).
2. **Variables**:
   - `GEMINI_API_KEY=<key>`
   - `KAGGLE_USERNAME=<kullanıcı adı>`
   - `KAGGLE_KEY=<key>`
   - `DB_SERVER=mssql.railway.internal` (Railway private network DNS adı — servis adın `mssql` değilse ona göre değiştir)
   - `DB_PORT=1433`
   - `DB_NAME=masi`
   - `DB_USER=sa`
   - `DB_PASSWORD=<mssql servisindeki MSSQL_SA_PASSWORD ile aynı>`
   - `DB_DRIVER=ODBC Driver 18 for SQL Server`
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

1. Üç servisi de oluştur, `backend` ve `frontend` için domain üret (henüz doğru env değerleri girmeden).
2. Şimdi domainleri öğrendin — `CORS_ORIGINS` ve `NEXT_PUBLIC_API_URL` değişkenlerini gerçek domainlerle güncelle.
3. Backend ve frontend servislerini yeniden deploy et (env değişikliği otomatik redeploy tetikler).

## Doğrulama

- `backend` servis loglarında `Tablolar oluşturuldu (veya zaten mevcuttu).` mesajını gör.
- `https://<backend-domain>/health` → `{"status": "ok"}`.
- Frontend'i tarayıcıda aç, network sekmesinde backend'e giden isteklerde CORS hatası olmadığını doğrula.
