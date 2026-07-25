import type { ArticleDetail, ArticleListItem } from "@/types/article";
import type { BulletinPage } from "@/types/huggingface";

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
