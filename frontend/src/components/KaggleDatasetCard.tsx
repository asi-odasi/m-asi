import type { KaggleDatasetSummary } from "@/types/kaggle";
import { StarButton } from "./ui/StarButton";

interface Props {
  dataset: KaggleDatasetSummary;
  onToggleFavorite: () => void;
}

function formatCount(value: number | null): string {
  if (value === null) return "—";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function KaggleDatasetCard({ dataset, onToggleFavorite }: Props) {
  return (
    <li className="rounded-xl border border-brand-200 bg-white px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={dataset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-brand-text hover:underline"
          >
            {dataset.title}
          </a>
          {dataset.subtitle && <p className="mt-1 text-sm text-brand-muted">{dataset.subtitle}</p>}

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-brand-700">
            {dataset.owner_name && <span className="rounded-full bg-brand-100 px-3 py-1">{dataset.owner_name}</span>}
            <span className="rounded-full bg-brand-100 px-3 py-1">▲ {formatCount(dataset.vote_count)} oy</span>
            <span className="rounded-full bg-brand-100 px-3 py-1">⬇ {formatCount(dataset.download_count)} indirme</span>
            {dataset.last_updated && (
              <span className="rounded-full bg-brand-100 px-3 py-1">
                {new Date(dataset.last_updated).toLocaleDateString("tr-TR")}
              </span>
            )}
          </div>
        </div>
        <StarButton isFavorite={dataset.is_favorite} onToggle={onToggleFavorite} />
      </div>
    </li>
  );
}
