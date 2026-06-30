"use client";

import type { ReactNode } from "react";
import { LanguageToggle } from "./LanguageToggle";
import type { Language } from "@/lib/types";

interface KioskLayoutProps {
  children: ReactNode;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  showLanguageToggle?: boolean;
  brandName?: string;
  tagline?: string;
  logoUrl?: string | null;
}

export function KioskLayout({
  children,
  language,
  onLanguageChange,
  showLanguageToggle = true,
  brandName = "YOBELL",
  tagline,
  logoUrl,
}: KioskLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--yobell-primary)] text-2xl font-black text-white shadow-lg">
              Y
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--yobell-primary)]">
              {brandName}
            </h1>
            {tagline && (
              <p className="text-sm font-medium text-[var(--yobell-muted)]">
                {tagline}
              </p>
            )}
          </div>
        </div>
        {showLanguageToggle && (
          <LanguageToggle language={language} onChange={onLanguageChange} />
        )}
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-8 pb-10">
        <div className="w-full max-w-5xl animate-fade-in-up">{children}</div>
      </main>
    </div>
  );
}
