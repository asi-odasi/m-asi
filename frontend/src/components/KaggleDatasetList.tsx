import type { KaggleDatasetSummary } from "@/types/kaggle";
import { KaggleDatasetCard } from "./KaggleDatasetCard";

interface Props {
  datasets: KaggleDatasetSummary[];
  onToggleFavorite: (ref: string) => void;
  emptyMessage?: string;
}

export function KaggleDatasetList({ datasets, onToggleFavorite, emptyMessage }: Props) {
  if (datasets.length === 0) {
    return (
      <p className="py-16 text-center text-brand-muted">
        {emptyMessage ?? "Sonuç bulunamadı. Farklı bir anahtar kelime deneyin."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {datasets.map((dataset) => (
        <KaggleDatasetCard
          key={dataset.ref}
          dataset={dataset}
          onToggleFavorite={() => onToggleFavorite(dataset.ref)}
        />
      ))}
    </ul>
  );
}
