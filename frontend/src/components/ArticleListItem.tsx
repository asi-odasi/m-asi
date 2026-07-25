import type { ArticleListItem as ArticleListItemType } from "@/types/article";
import { StarButton } from "./ui/StarButton";

interface Props {
  article: ArticleListItemType;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function ArticleListItem({ article, onClick, onToggleFavorite }: Props) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-start gap-3 rounded-xl border border-brand-200 bg-white px-5 py-4 text-left transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-brand-text">{article.Title}</p>
          <p className="mt-1 text-sm text-brand-muted">
            {article.Authors.length > 0 ? article.Authors.join(", ") : "Yazar bilgisi yok"}
          </p>
        </div>
        <StarButton isFavorite={article.IsFavorite} onToggle={onToggleFavorite} />
      </button>
    </li>
  );
}
