export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="152"
      height="40"
      viewBox="0 0 152 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="m-asi logo"
      className={className}
    >
      <rect x="0" y="0" width="40" height="40" rx="12" fill="#9CCEEA" />
      <text x="20" y="27" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="20" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
        m
      </text>
      <circle cx="54" cy="23" r="2.5" fill="#9CCEEA" />
      <text x="63" y="28" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="22" fontWeight="600" letterSpacing="0.5" fill="#4C86A8">
        asi
      </text>
    </svg>
  );
}
