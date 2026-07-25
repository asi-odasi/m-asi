"use client";

import { cleanBulletinText } from "@/lib/text";
import type { BulletinItem } from "@/types/huggingface";
import { StarButton } from "./ui/StarButton";

interface Props {
  bulletin: BulletinItem;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export function BulletinDetailModal({ bulletin, onClose, onToggleFavorite }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/30 p-4" onClick={onClose}>
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

        <div className="clear-both">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs text-brand-700">
              {bulletin.rating_label && (
                <span className="rounded-full bg-brand-100 px-3 py-1 font-medium">{bulletin.rating_label}</span>
              )}
              {bulletin.bulletin_number !== null && (
                <span className="rounded-full bg-brand-100 px-3 py-1">Bülten #{bulletin.bulletin_number}</span>
              )}
              {bulletin.date_published && (
                <span className="rounded-full bg-brand-100 px-3 py-1">
                  {new Date(bulletin.date_published).toLocaleDateString("tr-TR")}
                </span>
              )}
            </div>
            <StarButton isFavorite={bulletin.is_favorite} onToggle={onToggleFavorite} />
          </div>

          <h2 className="mt-3 whitespace-pre-line text-lg font-semibold text-brand-text">
            {cleanBulletinText(bulletin.claim)}
          </h2>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Doğruluk Kontrolü</p>
            <p className="mt-1 whitespace-pre-line leading-relaxed text-brand-text">
              {cleanBulletinText(bulletin.fact_check)}
            </p>
          </div>

          {bulletin.author && <p className="mt-4 text-sm text-brand-muted">Kaynak: {bulletin.author}</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            {bulletin.claim_url && (
              <a
                href={bulletin.claim_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Kayıt Detayı
              </a>
            )}
            {bulletin.source_url && (
              <a
                href={bulletin.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Bülten Kaynağı
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
