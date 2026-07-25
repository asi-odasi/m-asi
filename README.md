<div align="center">
  <img src="frontend/public/logo.svg" alt="m-asi logo" width="220" />

  ### Dezenformasyon Tespit ve Analiz Platformu

  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
  [![MS SQL Server](https://img.shields.io/badge/MS%20SQL%20Server-2022-CC2927?logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
  [![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Embeddings-8E44AD?logo=googlegemini)](https://ai.google.dev/)
  [![Kaggle](https://img.shields.io/badge/Kaggle-API-20BEFF?logo=kaggle)](https://www.kaggle.com/docs/api)
</div>

---

## Nedir?

**m-asi**, akademik yayınlar, resmi doğrulama kaynakları ve Kaggle veri setlerinden toplanan içerikleri semantik vektör analiziyle filtreleyip tek bir arayüzde sunan bir dezenformasyon araştırma aracıdır.

**Kimin işine yarar:** dezenformasyon/enformasyon bozukluğu üzerine çalışan araştırmacılar, gazeteciler, akademisyenler ve bu alanda güncel akademik literatürü + resmi fact-check kayıtlarını + açık veri setlerini tek yerden takip etmek isteyen herkes.

## Özellikler

- arXiv'den "disinformation" temalı akademik makalelerin otomatik taranması
- Google Gemini embedding'leri ile semantik benzerlik filtresi (yalnızca konuyla gerçekten ilgili makaleler sisteme girer)
- T.C. İletişim Başkanlığı'nın Hugging Face üzerindeki resmi doğrulama bültenleri entegrasyonu
- Kaggle API ile anahtar kelimeye göre canlı dezenformasyon/fake-news veri seti araması
- Kaynaklar arası geçiş (Makale / Hugging Face / Kaggle), her kaynağa özel filtreleme (tarih, anahtar kelime) ve sayfalama
- Yıldızlama: her üç kaynaktan da beğenilen kayıtları işaretleyip yalnızca favorileri listeleme

## Mimari

```
                 Gemini Embedding + Kosinüs Benzerliği
arXiv API  ───▶  (semantik filtre) ───────────────────▶ ┐
Hugging Face (İletişim Başkanlığı) ─────────────────────▶ ├─▶ MS SQL Server ─▶ FastAPI ─▶ Next.js
Kaggle API (canlı arama) ────────────────────────────────▶ ┘
```

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Veritabanı | Microsoft SQL Server (Docker) |
| Embedding / LLM | Google Gemini (`gemini-embedding-001`) |

Detaylı akış ve veritabanı şeması için [docs/architecture.md](docs/architecture.md).

## Analizde Kullanılan Kaynaklar

| Kaynak | İçerik | Nasıl işleniyor |
|---|---|---|
| [arXiv API](https://info.arxiv.org/help/api/) | Akademik makaleler | Gemini ile embed edilip referans "dezenformasyon" vektörüne kosinüs benzerliğine göre filtrelenir, MS SQL'e yazılır |
| [Hugging Face — `iletisim/dezenformasyon-bultenleri`](https://huggingface.co/datasets/iletisim/dezenformasyon-bultenleri) | T.C. İletişim Başkanlığı'nın ClaimReview formatındaki resmi doğrulama bültenleri | Zaten küratörlü olduğu için doğrudan sıralanıp/sayfalanıp sunulur |
| [Kaggle API](https://www.kaggle.com/docs/api) | Anahtar kelimeyle bulunan dezenformasyon/fake-news veri setleri (başlık, özet, oy/indirme sayısı) | Canlı aranır; yalnızca yıldızlanan veri setlerinin meta verisi MS SQL'e kaydedilir |

## Kurulum

```powershell
# 1) MS SQL Server (Docker)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<güçlü-bir-şifre>" `
  -p 1433:1433 --name m-asi-sql -d mcr.microsoft.com/mssql/server:2022-latest

# 2) Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py          # şemayı oluşturur
uvicorn app.main:app --reload --port 8000

# 3) Frontend
cd frontend
npm install
npm run dev
```

`.env` dosyasına `GEMINI_API_KEY`, `DB_*` ve `KAGGLE_USERNAME` / `KAGGLE_KEY` (kaggle.com/settings → API → Create New Token) bilgilerinizi girmeniz gerekir — bkz. `backend/.env.example`.

## Geliştirenler

Emine Hatun Dinçer · Şerife Nur Yılmaz
