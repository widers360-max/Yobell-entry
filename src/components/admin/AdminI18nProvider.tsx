"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Language } from "@/lib/types";
import { at, type AdminTranslationKey } from "@/lib/admin-i18n";

interface AdminI18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: AdminTranslationKey) => string;
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

const STORAGE_KEY = "yobell-admin-lang";

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ja");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "ja" || saved === "en" || saved === "ko") {
      setLangState(saved);
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <AdminI18nContext.Provider
      value={{ lang, setLang, t: (key) => at(lang, key) }}
    >
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) throw new Error("useAdminI18n must be used within AdminI18nProvider");
  return ctx;
}
