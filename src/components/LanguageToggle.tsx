"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
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
  variant?: "default" | "premium";
}

export function LanguageToggle({
  language,
  onChange,
  className = "",
  variant = "default",
}: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const langs: Language[] = ["ja", "en", "ko"];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (variant === "premium") {
    return (
      <div ref={ref} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 rounded-full border border-[var(--yobell-border)] bg-white px-5 py-3 shadow-sm transition-all active:scale-[0.98]"
        >
          <Globe className="h-5 w-5 text-[var(--yobell-navy)]" strokeWidth={1.75} />
          <span className="text-lg font-semibold text-[var(--yobell-navy)]">
            {labels[language]}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[var(--yobell-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-2xl border border-[var(--yobell-border)] bg-white shadow-xl">
            {langs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  onChange(lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left text-lg transition-colors hover:bg-[var(--yobell-cream)] ${
                  language === lang
                    ? "font-bold text-[var(--yobell-navy)]"
                    : "text-[var(--yobell-text)]"
                }`}
              >
                {labels[lang]}
                {language === lang && (
                  <Check className="h-5 w-5 text-[var(--yobell-gold)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

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
              ? "bg-[var(--yobell-navy)] text-white shadow-md"
              : "text-[var(--yobell-muted)] hover:bg-gray-100"
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
}
