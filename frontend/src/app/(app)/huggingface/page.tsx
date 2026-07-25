"use client";

import { useEffect, useState } from "react";
import { BulletinDetailModal } from "@/components/BulletinDetailModal";
import { BulletinList } from "@/components/BulletinList";
import { Loader } from "@/components/ui/Loader";
import { Pagination } from "@/components/ui/Pagination";
import { getBulletins, setBulletinFavorite } from "@/lib/api";
import type { BulletinItem } from "@/types/huggingface";

const PAGE_SIZE = 10;

type SortOrder = "newest" | "oldest";

export default function HuggingFacePage() {
  const [bulletins, setBulletins] = useState<BulletinItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<BulletinItem | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getBulletins({ offset: (currentPage - 1) * PAGE_SIZE, limit: PAGE_SIZE, sort: sortOrder, favoritesOnly })
      .then((page) => {
        setBulletins(page.items);
        setTotal(page.total);
      })
      .catch(() => setError("Bültenler yüklenirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }, [currentPage, sortOrder, favoritesOnly, reloadToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, favoritesOnly]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleToggleFavorite(id: string) {
    const target = bulletins.find((b) => b.id === id);
    if (!target) return;

    const nextValue = !target.is_favorite;

    if (favoritesOnly && !nextValue) {
      setBulletins((prev) => prev.filter((b) => b.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } else {
      setBulletins((prev) => prev.map((b) => (b.id === id ? { ...b, is_favorite: nextValue } : b)));
    }

    setSelected((prev) => (prev && prev.id === id ? { ...prev, is_favorite: nextValue } : prev));

    setBulletinFavorite(id, nextValue).catch(() => {
      setReloadToken((t) => t + 1);
    });
  }

  return (
    <>
      <h1 className="mb-1 text-lg font-semibold text-brand-text">Dezenformasyon Bültenleri</h1>
      <p className="mb-6 text-sm text-brand-muted">
        Kaynak: T.C. Cumhurbaşkanlığı İletişim Başkanlığı — Hugging Face üzerinden
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
          className="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          {sortOrder === "newest" ? "↓ En Yeni" : "↑ En Eski"}
        </button>

        <button
          onClick={() => setFavoritesOnly((prev) => !prev)}
          aria-pressed={favoritesOnly}
          className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 ${
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
          <BulletinList
            bulletins={bulletins}
            onSelect={setSelected}
            onToggleFavorite={handleToggleFavorite}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {selected && (
        <BulletinDetailModal
          bulletin={selected}
          onClose={() => setSelected(null)}
          onToggleFavorite={() => handleToggleFavorite(selected.id)}
        />
      )}
    </>
  );
}
