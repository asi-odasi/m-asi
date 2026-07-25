export interface BulletinItem {
  id: string;
  bulletin_number: number | null;
  date_published: string | null;
  claim: string;
  fact_check: string;
  rating_value: string | null;
  rating_label: string | null;
  claim_url: string | null;
  source_url: string | null;
  author: string | null;
  is_favorite: boolean;
}

export interface BulletinPage {
  items: BulletinItem[];
  total: number;
  offset: number;
  limit: number;
}
