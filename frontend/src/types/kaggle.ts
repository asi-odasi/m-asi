export interface KaggleDatasetSummary {
  ref: string;
  title: string;
  subtitle: string | null;
  url: string;
  owner_name: string | null;
  vote_count: number | null;
  download_count: number | null;
  last_updated: string | null;
  is_favorite: boolean;
}

export interface KaggleSearchResponse {
  items: KaggleDatasetSummary[];
  query: string;
  page: number;
}
