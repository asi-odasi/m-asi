"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleDetailContent } from "@/components/ArticleDetailContent";
import { Loader } from "@/components/ui/Loader";
import { getArticle } from "@/lib/api";
import type { ArticleDetail } from "@/types/article";

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArticle(Number(params.id))
      .then(setArticle)
      .catch(() => setError("Makale yüklenirken bir hata oluştu."));
  }, [params.id]);

  return (
    <div>
      <Link href="/dashboard" className="mb-6 inline-block text-sm text-brand-700 hover:underline">
        ← Listeye dön
      </Link>

      {error && <p className="text-red-500">{error}</p>}
      {!error && !article && <Loader />}
      {article && (
        <div className="rounded-2xl border border-brand-200 bg-white p-6">
          <ArticleDetailContent article={article} />
        </div>
      )}
    </div>
  );
}
