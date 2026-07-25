import type { ArticleDetail } from "@/types/article";
import { StarButton } from "./ui/StarButton";

interface Props {
  article: ArticleDetail;
  onToggleFavorite?: () => void;
}

export function ArticleDetailContent({ article, onToggleFavorite }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-brand-text">{article.Title}</h2>
        {onToggleFavorite && (
          <StarButton isFavorite={article.IsFavorite} onToggle={onToggleFavorite} className="mt-0.5" />
        )}
      </div>
      <p className="mt-1 text-sm text-brand-muted">{article.Authors.join(", ")}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-700">
        {article.Categories && <span className="rounded-full bg-brand-100 px-3 py-1">{article.Categories}</span>}
        {article.PublishedDate && (
          <span className="rounded-full bg-brand-100 px-3 py-1">
            {new Date(article.PublishedDate).toLocaleDateString("tr-TR")}
          </span>
        )}
        {article.SimilarityScore !== null && (
          <span className="rounded-full bg-brand-100 px-3 py-1">
            Benzerlik: {(article.SimilarityScore * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-text">{article.Abstract}</p>

      {article.PdfUrl && (
        <a
          href={article.PdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-xl bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          PDF&apos;i Görüntüle
        </a>
      )}
    </div>
  );
}
