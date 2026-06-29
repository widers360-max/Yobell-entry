"use client";

import type { Language } from "@/lib/types";

const labels: Record<Language, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
};

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export function LanguageToggle({
  language,
  onChange,
  className = "",
}: LanguageToggleProps) {
  const langs: Language[] = ["ja", "en", "ko"];

  return (
    <div
      className={`flex gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm backdrop-blur ${className}`}
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`rounded-xl px-6 py-3 text-lg font-semibold transition-all ${
            language === lang
              ? "bg-[var(--yobell-primary)] text-white shadow-md"
              : "text-[var(--yobell-muted)] hover:bg-gray-100"
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
}
