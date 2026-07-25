"use client";

import { useEffect, useState } from "react";
import { KaggleDatasetList } from "@/components/KaggleDatasetList";
import { Loader } from "@/components/ui/Loader";
import { getKaggleFavorites, searchKaggleDatasets, setKaggleFavorite } from "@/lib/api";
import type { KaggleDatasetSummary } from "@/types/kaggle";

const DEFAULT_QUERY = "Turkish fake news";

export default function KagglePage() {
  const [queryInput, setQueryInput] = useState(DEFAULT_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [page, setPage] = useState(1);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [datasets, setDatasets] = useState<KaggleDatasetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const request = favoritesOnly ? getKaggleFavorites() : searchKaggleDatasets(activeQuery, page);

    request
      .then((result) => setDatasets(Array.isArray(result) ? result : result.items))
      .catch(() => setError("Veri setleri yüklenirken bir hata oluştu. Kaggle API bilgilerinizi kontrol edin."))
      .finally(() => setLoading(false));
  }, [activeQuery, page, favoritesOnly, reloadToken]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFavoritesOnly(false);
    setPage(1);
    setActiveQuery(queryInput.trim() || DEFAULT_QUERY);
  }

  function handleToggleFavorite(ref: string) {
    const target = datasets.find((d) => d.ref === ref);
    if (!target) return;

    const nextValue = !target.is_favorite;

    if (favoritesOnly && !nextValue) {
      setDatasets((prev) => prev.filter((d) => d.ref !== ref));
    } else {
      setDatasets((prev) => prev.map((d) => (d.ref === ref ? { ...d, is_favorite: nextValue } : d)));
    }

    setKaggleFavorite(target, nextValue).catch(() => {
      setReloadToken((t) => t + 1);
    });
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-brand-text">Kaggle Veri Setleri</h1>
      <p className="mb-6 text-sm text-brand-muted">
        Anahtar kelimeyle dezenformasyon / fake news temalı veri setlerini Kaggle&apos;da arayın.
      </p>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="örn. Turkish disinformation, fake news..."
            className="flex-1 rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            Filtrele
          </button>
        </form>

        <button
          onClick={() => {
            setFavoritesOnly((prev) => !prev);
            setPage(1);
          }}
          aria-pressed={favoritesOnly}
          className={`whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 ${
            favoritesOnly
              ? "border-brand-400 bg-brand-400 text-white hover:bg-brand-600"
              : "border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
          }`}
        >
          ★ Yıldızlılar
        </button>
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <KaggleDatasetList
            datasets={datasets}
            onToggleFavorite={handleToggleFavorite}
            emptyMessage={favoritesOnly ? "Henüz yıldızladığınız bir veri seti yok." : undefined}
          />

          {!favoritesOnly && (
            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Sayfalama">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                ‹ Önceki
              </button>
              <span className="text-sm text-brand-muted">Sayfa {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={datasets.length === 0}
                className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                Sonraki ›
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
