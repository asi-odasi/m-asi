"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const SOURCE_OPTIONS = [
  { href: "/dashboard", label: "Makale" },
  { href: "/huggingface", label: "Hugging Face" },
  { href: "/kaggle", label: "Kaggle" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-brand-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Ana sayfa">
          <Logo />
        </Link>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            Kaynak
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <path d="M2 4l4 4 4-4" stroke="#4C86A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen && (
            <ul
              role="menu"
              className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-brand-200 bg-white shadow-lg"
            >
              {SOURCE_OPTIONS.map((option) => (
                <li key={option.href} role="none">
                  <Link
                    href={option.href}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 ${
                      pathname === option.href ? "bg-brand-100 font-medium text-brand-700" : "text-brand-text"
                    }`}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
