import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-6 text-left">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-brand-text">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{description}</p>
    </div>
  );
}
