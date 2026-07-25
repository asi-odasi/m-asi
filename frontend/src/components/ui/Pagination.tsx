interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageEntry = number | "ellipsis-start" | "ellipsis-end";

function getPageEntries(currentPage: number, totalPages: number, siblingCount = 1): PageEntry[] {
  const totalNumbersShown = siblingCount * 2 + 5; // ilk + son + mevcut + 2*sibling + 2*ellipsis

  if (totalPages <= totalNumbersShown) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const entries: PageEntry[] = [1];

  if (leftSibling > 2) entries.push("ellipsis-start");

  for (let page = Math.max(leftSibling, 2); page <= Math.min(rightSibling, totalPages - 1); page++) {
    entries.push(page);
  }

  if (rightSibling < totalPages - 1) entries.push("ellipsis-end");

  entries.push(totalPages);

  return entries;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const entries = getPageEntries(currentPage, totalPages);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Sayfalama">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-sm text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-300"
        aria-label="Önceki sayfa"
      >
        ‹
      </button>

      {entries.map((entry) =>
        typeof entry === "number" ? (
          <button
            key={entry}
            onClick={() => onPageChange(entry)}
            aria-current={entry === currentPage ? "page" : undefined}
            className={`min-w-[2.25rem] rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 ${
              entry === currentPage
                ? "border-brand-400 bg-brand-400 text-white"
                : "border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            {entry}
          </button>
        ) : (
          <span key={entry} className="px-1 text-sm text-brand-muted" aria-hidden="true">
            …
          </span>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-sm text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-300"
        aria-label="Sonraki sayfa"
      >
        ›
      </button>
    </nav>
  );
}
