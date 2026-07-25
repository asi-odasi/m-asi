import type { ArticleDetail, ArticleListItem } from "@/types/article";
import type { BulletinPage } from "@/types/huggingface";
import type { KaggleDatasetSummary, KaggleSearchResponse } from "@/types/kaggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
  if (!res.ok) {
    throw new Error(`API isteği başarısız oldu: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getArticles(): Promise<ArticleListItem[]> {
  return apiFetch<ArticleListItem[]>("/articles");
}

export function getArticle(id: number): Promise<ArticleDetail> {
  return apiFetch<ArticleDetail>(`/articles/${id}`);
}

export function setArticleFavorite(id: number, isFavorite: boolean): Promise<ArticleListItem> {
  return apiFetch<ArticleListItem>(`/articles/${id}/favorite`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });
}

interface GetBulletinsOptions {
  offset: number;
  limit: number;
  sort: "newest" | "oldest";
  favoritesOnly: boolean;
}

export function getBulletins({ offset, limit, sort, favoritesOnly }: GetBulletinsOptions): Promise<BulletinPage> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    sort,
    favoritesOnly: String(favoritesOnly),
  });
  return apiFetch<BulletinPage>(`/huggingface/bulletins?${params}`);
}

export function setBulletinFavorite(id: string, isFavorite: boolean): Promise<{ id: string; isFavorite: boolean }> {
  return apiFetch<{ id: string; isFavorite: boolean }>(`/huggingface/bulletins/${encodeURIComponent(id)}/favorite`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFavorite }),
  });
}

export function searchKaggleDatasets(query: string, page: number): Promise<KaggleSearchResponse> {
  const params = new URLSearchParams({ query, page: String(page) });
  return apiFetch<KaggleSearchResponse>(`/kaggle/datasets?${params}`);
}

export function getKaggleFavorites(): Promise<KaggleDatasetSummary[]> {
  return apiFetch<KaggleDatasetSummary[]>("/kaggle/favorites");
}

export function setKaggleFavorite(
  dataset: KaggleDatasetSummary,
  isFavorite: boolean,
): Promise<{ ref: string; isFavorite: boolean }> {
  return apiFetch<{ ref: string; isFavorite: boolean }>(`/kaggle/favorites/${dataset.ref}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isFavorite,
      title: dataset.title,
      subtitle: dataset.subtitle,
      url: dataset.url,
      ownerName: dataset.owner_name,
      voteCount: dataset.vote_count,
      downloadCount: dataset.download_count,
      lastUpdated: dataset.last_updated,
    }),
  });
}
