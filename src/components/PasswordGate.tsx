"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { PasswordPrompt } from "./PasswordPrompt";
import { isUnlocked, type AuthRole } from "@/lib/auth-session";
import type { Language } from "@/lib/types";

const ADMIN_LANG_KEY = "yobell-admin-lang";

function resolveLanguage(role: AuthRole, language?: Language): Language {
  if (language) return language;
  if (typeof window === "undefined") return "ja";
  if (role === "admin") {
    const saved = localStorage.getItem(ADMIN_LANG_KEY);
    if (saved === "ja" || saved === "en" || saved === "ko") return saved;
  }
  return "ja";
}

export function PasswordGate({
  role,
  language,
  children,
}: {
  role: AuthRole;
  language?: Language;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlockedState] = useState(false);
  const [lang, setLang] = useState<Language>("ja");

  useEffect(() => {
    setLang(resolveLanguage(role, language));
    setUnlockedState(isUnlocked(role));
    setReady(true);
  }, [role, language]);

  if (!ready) {
    return (
      <div className="gate-loading">
        <Loader2 className="h-8 w-8 animate-spin text-yobell-gold" />
        <p className="text-sm">読み込み中...</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="admin-section-enter">
        <PasswordPrompt
          role={role}
          language={lang}
          variant="page"
          onSuccess={() => setUnlockedState(true)}
        />
      </div>
    );
  }

  return <div className="admin-section-enter">{children}</div>;
}
