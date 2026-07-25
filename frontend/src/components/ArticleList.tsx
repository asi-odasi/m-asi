import type { ArticleListItem as ArticleListItemType } from "@/types/article";
import { ArticleListItem } from "./ArticleListItem";

interface Props {
  articles: ArticleListItemType[];
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  emptyMessage?: string;
}

export function ArticleList({ articles, onSelect, onToggleFavorite, emptyMessage }: Props) {
  if (articles.length === 0) {
    return (
      <p className="py-16 text-center text-brand-muted">
        {emptyMessage ?? "Henüz filtreyi geçen bir makale yok."}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {articles.map((article) => (
        <ArticleListItem
          key={article.ArticleId}
          article={article}
          onClick={() => onSelect(article.ArticleId)}
          onToggleFavorite={() => onToggleFavorite(article.ArticleId)}
        />
      ))}
    </ul>
  );
}
