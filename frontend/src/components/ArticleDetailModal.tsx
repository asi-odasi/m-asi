"use client";

import { useEffect, useState } from "react";
import { getArticle, setArticleFavorite } from "@/lib/api";
import type { ArticleDetail } from "@/types/article";
import { ArticleDetailContent } from "./ArticleDetailContent";
import { Loader } from "./ui/Loader";

interface Props {
  articleId: number;
  onClose: () => void;
  onFavoriteChange?: (id: number, isFavorite: boolean) => void;
}

export function ArticleDetailModal({ articleId, onClose, onFavoriteChange }: Props) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setArticle(null);
    setError(null);

    getArticle(articleId)
      .then((data) => {
        if (!cancelled) setArticle(data);
      })
      .catch(() => {
        if (!cancelled) setError("Makale yüklenirken bir hata oluştu.");
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  function handleToggleFavorite() {
    if (!article) return;

    const nextValue = !article.IsFavorite;
    setArticle({ ...article, IsFavorite: nextValue });
    onFavoriteChange?.(article.ArticleId, nextValue);

    setArticleFavorite(article.ArticleId, nextValue).catch(() => {
      setArticle((prev) => (prev ? { ...prev, IsFavorite: !nextValue } : prev));
      onFavoriteChange?.(article.ArticleId, !nextValue);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/30 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right rounded-full px-2 py-1 text-brand-muted hover:bg-brand-50"
          aria-label="Kapat"
        >
          ✕
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {!error && !article && <Loader />}

        {article && (
          <div className="clear-both">
            <ArticleDetailContent article={article} onToggleFavorite={handleToggleFavorite} />
          </div>
        )}
      </div>
    </div>
  );
}
