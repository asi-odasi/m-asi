interface Props {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
}

export function StarButton({ isFavorite, onToggle, className = "" }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorite ? "Yıldızı kaldır" : "Yıldızla"}
      aria-pressed={isFavorite}
      className={`shrink-0 rounded-full p-1.5 transition-colors hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-300 ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#63A6CC" : "none"}
        stroke={isFavorite ? "#63A6CC" : "#9CCEEA"}
        strokeWidth="1.75"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3.5z"
        />
      </svg>
    </button>
  );
}
