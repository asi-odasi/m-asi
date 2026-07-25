import { cleanBulletinText, truncate } from "@/lib/text";
import type { BulletinItem } from "@/types/huggingface";
import { StarButton } from "./ui/StarButton";

interface Props {
  bulletin: BulletinItem;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function BulletinListItem({ bulletin, onClick, onToggleFavorite }: Props) {
  const claimPreview = truncate(cleanBulletinText(bulletin.claim), 160);

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-start gap-3 rounded-xl border border-brand-200 bg-white px-5 py-4 text-left transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-brand-700">
            {bulletin.rating_label && (
              <span className="rounded-full bg-brand-100 px-3 py-1 font-medium">{bulletin.rating_label}</span>
            )}
            {bulletin.date_published && (
              <span className="rounded-full bg-brand-100 px-3 py-1">
                {new Date(bulletin.date_published).toLocaleDateString("tr-TR")}
              </span>
            )}
          </div>
          <p className="mt-2 text-base font-semibold text-brand-text">{claimPreview}</p>
        </div>
        <StarButton isFavorite={bulletin.is_favorite} onToggle={onToggleFavorite} />
      </button>
    </li>
  );
}
