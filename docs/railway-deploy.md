# Railway Deploy Rehberi

m-asi, tek bir Railway projesi altında **3 ayrı servis** olarak deploy edilir:

| Servis | Kaynak | Root directory |
|---|---|---|
| `mssql` | Bu repo (Dockerfile ile build) | `infra/mssql` |
| `backend` | Bu repo (Dockerfile ile build) | `backend` |
| `frontend` | Bu repo (Nixpacks, Next.js otomatik algılanır) | `frontend` |

Railway'de MS SQL Server için yerleşik (managed) bir eklenti yok, bu yüzden resmi Docker imajı `infra/mssql/Dockerfile` üzerinden özelleştirilerek ayrı bir servis olarak çalıştırılıyor.

## 1) `mssql` servisi

1. Railway projesinde **New → GitHub Repo** ile bu repoyu bağla, **Root Directory** = `infra/mssql`. Railway `infra/mssql/railway.json`'ı görüp Dockerfile ile build edecek.
2. **Variables**:
   - `ACCEPT_EULA=Y`
   - `MSSQL_SA_PASSWORD=<güçlü bir şifre>`
   - `MSSQL_PID=Developer`
3. **Volume** ekle, mount path: `/var/opt/mssql` (aksi halde her redeploy'da veriler silinir).
4. Bu servise **public domain oluşturma** — backend zaten private network üzerinden erişecek.

> ⚠️ `Developer` edition ücretsizdir ama üretimde (production/ticari) kullanım için lisanslı değildir. Gerçek kullanıcı verisiyle canlıya çıkacaksanız Microsoft'un lisans şartlarını kontrol edin veya Azure SQL gibi lisanslı bir üretim ortamına geçmeyi değerlendirin.

> **Neden özel Dockerfile?** Resmi `mcr.microsoft.com/mssql/server` imajı Railway'in kısıtlı (sandboxed) container ortamında doğrudan çalıştırıldığında `The system directory [/.system] could not be created ... Permission denied` hatasıyla çöküyor (SQL Server 2019 ve 2022'de aynı hata görüldü). `infra/mssql/Dockerfile`, bu dizini image build sırasında (tam yetkiyle) önceden oluşturup doğru sahiplik/izinle image'a gömüyor; böylece runtime'da sqlservr yeni dizin oluşturmaya çalışmıyor.

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
