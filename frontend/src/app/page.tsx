"use client";

import { useEffect, useMemo, useState } from "react";
import { ArticleDetailModal } from "@/components/ArticleDetailModal";
import { ArticleList } from "@/components/ArticleList";
import { Loader } from "@/components/ui/Loader";
import { Pagination } from "@/components/ui/Pagination";
import { getArticles, setArticleFavorite } from "@/lib/api";
import type { ArticleListItem } from "@/types/article";

type SortOrder = "newest" | "oldest";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .catch(() => setError("Makaleler yüklenirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }, []);

  const visibleArticles = useMemo(() => {
    const filtered = showFavoritesOnly ? articles.filter((a) => a.IsFavorite) : articles;

    return [...filtered].sort((a, b) => {
      const aTime = a.PublishedDate ? new Date(a.PublishedDate).getTime() : 0;
      const bTime = b.PublishedDate ? new Date(b.PublishedDate).getTime() : 0;
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [articles, sortOrder, showFavoritesOnly]);

  const totalPages = Math.max(1, Math.ceil(visibleArticles.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = visibleArticles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, showFavoritesOnly]);

  function handleToggleFavorite(id: number) {
    const target = articles.find((a) => a.ArticleId === id);
    if (!target) return;

    const nextValue = !target.IsFavorite;
    setArticles((prev) => prev.map((a) => (a.ArticleId === id ? { ...a, IsFavorite: nextValue } : a)));

    setArticleFavorite(id, nextValue).catch(() => {
      setArticles((prev) => prev.map((a) => (a.ArticleId === id ? { ...a, IsFavorite: !nextValue } : a)));
    });
  }

  function handleFavoriteChangeFromModal(id: number, isFavorite: boolean) {
    setArticles((prev) => prev.map((a) => (a.ArticleId === id ? { ...a, IsFavorite: isFavorite } : a)));
  }

  return (
    <>
      <h1 className="mb-6 text-lg font-semibold text-brand-text">Dezenformasyon Araştırmaları</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
          className="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          {sortOrder === "newest" ? "↓ En Yeni" : "↑ En Eski"}
        </button>

        <button
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          aria-pressed={showFavoritesOnly}
          className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 ${
            showFavoritesOnly
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
          <ArticleList
            articles={paginatedArticles}
            onSelect={setSelectedId}
            onToggleFavorite={handleToggleFavorite}
            emptyMessage={showFavoritesOnly ? "Henüz yıldızladığınız bir makale yok." : undefined}
          />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {selectedId !== null && (
        <ArticleDetailModal
          articleId={selectedId}
          onClose={() => setSelectedId(null)}
          onFavoriteChange={handleFavoriteChangeFromModal}
        />
      )}
    </>
  );
}
