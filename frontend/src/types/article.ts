export interface ArticleListItem {
  ArticleId: number;
  Title: string;
  Authors: string[];
  PublishedDate: string | null;
  IsFavorite: boolean;
}

export interface ArticleDetail {
  ArticleId: number;
  ArxivId: string;
  Title: string;
  Authors: string[];
  Abstract: string;
  Categories: string | null;
  PublishedDate: string | null;
  UpdatedDate: string | null;
  PdfUrl: string | null;
  SimilarityScore: number | null;
  IsFavorite: boolean;
}
