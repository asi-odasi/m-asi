<div align="center">

# 🛡️ m-asi | Dezenformasyon Tespit ve Analiz Platformu

**Yapay Zeka ve Semantik Vektör Analizi Tabanlı Çok Kaynaklı Dezenformasyon Doğrulama ve Filtreleme Sistemi**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![MS SQL Server](https://img.shields.io/badge/MS%20SQL%20Server-2022-CC292B?style=for-the-badge&logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-Vector%20Embedding-8E44AD?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)

---

### 👥 Geliştirici Ekibi
Bu proje, **Emine Hatun Dinçer** ve **Şerife Nur Yılmaz** tarafından ortak bir takım çalışması olarak geliştirilmektedir.

---

</div>

## 📌 Proje Görselleri ve Arayüz Önizlemesi

| Arayüz Önizlemesi (Pastel Mavi Minimalist Tema) | Sistem Mimarisi ve Akış Diyagramı |
| :---: | :---: |
| ![m-asi Platform Arayüzü](https://raw.githubusercontent.com/asi-odasi/m-asi/main/docs/assets/dashboard-preview.png) | ![Sistem Mimarisi](https://raw.githubusercontent.com/asi-odasi/m-asi/main/docs/assets/architecture-diagram.png) |

| Veri Analiz & Vektörel Filtreleme Grafiği | Dinamik Kaynak Filtreleme & Yıldızlama |
| :---: | :---: |
| ![Veri Analiz Grafiği](https://raw.githubusercontent.com/asi-odasi/m-asi/main/docs/assets/analytics-chart.png) | ![Dinamik Filtreleme Arayüzü](https://raw.githubusercontent.com/asi-odasi/m-asi/main/docs/assets/source-filtering.png) |

---

## 📖 Proje Hakkında

**m-asi**, dijital bilgi ekosisteminde hızla yayılan dezenformasyon, yanlış bilgi ve manipülatif içeriklerin tespiti ve analizi amacıyla tasarlanmış **akademik tabanlı ve veriye dayalı** bir doğrulama platformudur.

Platform; arXiv akademik veritabanından, resmi açık kaynak verilerinden ve bağımsız dezenformasyon veri setlerinden toplanan metinleri **Google Gemini API** aracılığıyla yüksek boyutlu vektörlere dönüştürür. Ankor (referans) dezenformasyon vektörleri ile metin vektörleri arasındaki **Kosinüs Benzerliği (Cosine Similarity)** matrisleri hesaplanarak, belirlenen semantik eşik değerini geçen içerikler otomatik olarak filtrelenir ve ilişkisel veritabanında yapılandırılır.

### 🎨 Tasarım Dili ve Kullanıcı Deneyimi
- **Minimalist ve Modern:** Gözü yormayan açık pastel mavi tonları (`#F0F4F8`, `#3B82F6`, `#1E3A8A`) ve temiz beyaz arka plan üzerine kurulu estetik tasarım.
- **Kullanıcı Dostu:** Karmaşık vektörel verileri basitleştirilmiş kartlar, dinamik filtreleme araçları ve detaylı analiz modalleri ile sunan modern kullanıcı arayüzü.

---

## 🚀 Proje Geliştirme Aşamaları (Roadmap)

```mermaid
gantt
    title m-asi Geliştirme Süreci ve Yol Haritası
    dateFormat  YYYY-MM-DD
    section Aşama 1 (Tamamlandı)
    Docker & MS SQL Altyapısı          :done,    a1, 2026-01-01, 2026-02-15
    arXiv API Ingestion Pipeline       :done,    a2, 2026-02-01, 2026-03-01
    Gemini Embedding & Cosine Filter   :done,    a3, 2026-03-01, 2026-04-01
    section Aşama 2 (Geliştirme Aşamasında)
    Hugging Face Veri Entegrasyonu    :active,  b1, 2026-04-01, 2026-05-15
    Navbar Dinamik 'Kaynak' Menüsü    :active,  b2, 2026-05-01, 2026-06-15
    section Aşama 3 (Planlanıyor)
    Kaggle Fake News Entegrasyonu      :planned, c1, 2026-06-15, 2026-07-30
    Gelişmiş Vektörel Filtreleme       :planned, c2, 2026-07-01, 2026-08-15
    Yıldızlama (Favori) Sistemi        :planned, c3, 2026-08-01, 2026-09-01
```

### ✅ Aşama 1: Temel Veri Boru Hattı ve Veritabanı Altyapısı (Tamamlandı)
- **Containerized DB:** Docker üzerinde MS SQL Server (`mcr.microsoft.com/mssql/server:2022-latest`) container kurulumu gerçekleştirildi.
- **Güvenli Bağlantı:** PyODBC ve ODBC Driver 18 for SQL Server yapılandırmaları ile TLS/SSL şifreli veritabanı bağlantısı oluşturuldu.
- **arXiv Ingestion:** arXiv e-Print API'sinden (`cs.CL`, `cs.SI`, `cs.CY` kategorileri) rate-limit kurallarına (3 saniye gecikme) tam uyumlu veri çekme pipeline'ı kuruldu.
- **Semantik Filtre:** Google Gemini API tabanlı vektörleştirme ve kosinüs benzerliği eşik denetimi tamamlandı.

### 🚧 Aşama 2: Çoklu Kaynak Desteği ve Arayüz Geliştirmeleri (Geliştirme Aşamasında)
- **T.C. İletişim Başkanlığı Verileri:** Hugging Face üzerindeki açık kaynaklı doğrulama ve bülten verileri sisteme entegre ediliyor.
- **Dinamik Kaynak Yönetimi:** Frontend Navbar üzerine eklenen **'Kaynak'** açılır menüsü (Dropdown) ile kullanıcıların akademik makaleler (arXiv) ve resmi bültenler arasında anlık geçiş yapabilmesi sağlanıyor.

### 📌 Aşama 3: Gelişmiş Vektörel Filtreleme ve Etkileşim Araçları (Planlanıyor)
- **Kaggle Veri Setleri:** Global "fake news" ve "disinformation" veri setlerinin sisteme dahil edilerek Gemini ile yüksek boyutlu vektör uzayına aktarılması.
- **Dinamik Analiz Araçları:** Benzerlik skoru, tarih aralığı ve konu etiketlerine göre arayüzde anlık vektörel filtreleme paneli.
- **Yıldızlama (Favori) Sistemi:** Kullanıcıların analiz ettikleri verileri kişisel panellerine kaydetmelerini sağlayan favorileme altyapısı.

---

## 🛠️ Teknik Mimari ve Analitik Veri Akışı

```
[ Veri Kaynakları ]          [ Vektörleştirme & Filtreleme ]       [ Depolama & Sunum ]
+-------------------+        +----------------------------+        +-------------------+
|  arXiv API        |        |  Google Gemini API         |        |  Docker MS SQL    |
|  Hugging Face     |  --->  |  (768-d Vector Embedding)  |  --->  |  Server 2022      |
|  Kaggle Datasets  |        |  Cosine Similarity Filter  |        +---------+---------+
+-------------------+        +----------------------------+                  |
                                                                             v
                                                                   +-------------------+
                                                                   |  Node.js / Express|
                                                                   |  / FastAPI Engine |
                                                                   +---------+---------+
                                                                             |
                                                                             v
                                                                   +-------------------+
                                                                   |  Next.js (14.2)   |
                                                                   |  Pastel UI        |
                                                                   +-------------------+
```

---

## 💻 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler
- **Node.js**: `v18.x` veya üzeri
- **Python**: `3.10+` (Pipeline çalıştırma için)
- **Docker Desktop**: MS SQL Server container'ı için
- **Google Gemini API Key**: Vektör embedding üretimi için

---

### 🔑 1. Ortam Değişkenlerinin Yapılandırılması (.env)

> [!IMPORTANT]
> Projenin sorunsuz çalışabilmesi için kök dizinde `.env` dosyasının doğru bilgilerle oluşturulması **kritik öneme sahiptir**. `LLM_API_KEY` olmadan vektörel analiz servisi çalışmayacak ve hata verecektir.

Projeyi klonladıktan sonra kök dizindeki `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli alanları doldurun:

```bash
cp .env.example .env
```

`.env` içeriği aşağıdaki gibidir:

```env
# Google Gemini API Konfigürasyonu
LLM_API_KEY=your_google_gemini_api_key_here

# MS SQL Server Bağlantı Bilgileri (Docker)
MSSQL_SERVER=localhost,1433
MSSQL_DATABASE=m_asi_db
MSSQL_USER=sa
MSSQL_PASSWORD=YourStrong!Password123
MSSQL_ENCRYPT=no
MSSQL_TRUST_SERVER_CERTIFICATE=yes

# Vektörel Filtreleme Parametreleri
SIMILARITY_THRESHOLD=0.75
```

---

### 🐳 2. Veritabanı Kurulumu (Docker MS SQL Server)

MS SQL Server 2022 Docker container'ını başlatın:

```powershell
docker run -e "ACCEPT_EULA=Y" `
  -e "MSSQL_SA_PASSWORD=YourStrong!Password123" `
  -p 1433:1433 `
  --name mssql-m-asi `
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Veritabanı şemasını oluşturmak için:

```powershell
sqlcmd -S localhost,1433 -U sa -P "YourStrong!Password123" -i backend/app/db/schema.sql
```

---

### ⚙️ 3. Backend ve Ingestion Pipeline Kurulumu

```powershell
# Backend dizinine geçin
cd backend

# Sanal ortam oluşturun ve aktifleştirin
python -m venv .venv
.venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Ingestion Pipeline'ı manuel tetiklemek için:
python scripts/run_ingestion.py

# Backend servisini başlatın:
uvicorn app.main:app --reload --port 8000
```

---

### 🎨 4. Frontend Kurulumu (Next.js)

```powershell
# Frontend dizinine geçin
cd frontend

# Paketleri yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev
```

Uygulama **`http://localhost:3000`** adresinde erişime açılacaktır.

---

## 👥 Geliştiriciler (Developers)

| [<img src="https://github.com/eminehatundincer.png?size=115" width="115"><br><sub><b>Emine Hatun Dinçer</b></sub>](https://github.com/eminehatundincer) | [<img src="https://github.com/serifenuryilmaz.png?size=115" width="115"><br><sub><b>Şerife Nur Yılmaz</b></sub>](https://github.com/serifenuryilmaz) |
| :---: | :---: |
| Developer | Developer |

---

## 📄 Lisans

Bu proje açık kaynaklı olup [MIT License](LICENSE) şartları kapsamında sunulmaktadır.
