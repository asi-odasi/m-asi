import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { Logo } from "@/components/Logo";

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FEATURES = [
  {
    title: "arXiv Akademik Tarama",
    description:
      "Dezenformasyon temalı akademik makaleler otomatik taranır; Gemini embedding'leri ile semantik benzerliğine göre filtrelenip veritabanına kaydedilir.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    title: "Hugging Face — Resmi Bültenler",
    description:
      "T.C. İletişim Başkanlığı'nın ClaimReview formatındaki doğrulama bültenleri, sıralanıp sayfalanarak sunulur.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Kaggle Entegrasyonu",
    description:
      "Anahtar kelimeyle dezenformasyon/fake-news temalı veri setleri Kaggle API üzerinden canlı olarak aranır.",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M20 20l-5.2-5.2" />
      </svg>
    ),
  },
  {
    title: "Filtreleme ve Yıldızlama",
    description:
      "Her kaynakta tarih/anahtar kelimeye göre filtreleme yapılabilir; ilgi çeken kayıtlar yıldızlanıp favorilerde tutulur.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.5z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-16 text-center">
      <Logo />

      <h1 className="mt-8 max-w-2xl text-2xl font-semibold leading-snug text-brand-text sm:text-3xl">
        Yapay Zeka ve Semantik Vektör Analizi Tabanlı Dezenformasyon Tespiti
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-muted">
        m-asi; akademik yayınları, resmi doğrulama kaynaklarını ve açık veri setlerini tek bir platformda
        toplayıp semantik vektör analiziyle dezenformasyonla ilgili içerikleri filtreler.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 rounded-xl bg-brand-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        Sisteme Giriş Yap →
      </Link>

      <div className="mt-16 grid w-full gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
