"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  type AuthRole,
  setUnlocked,
  verifyPassword,
} from "@/lib/auth-session";
import type { Language } from "@/lib/types";

interface PasswordPromptProps {
  role: AuthRole;
  language?: Language;
  variant?: "modal" | "page";
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PasswordPrompt({
  role,
  language = "ja",
  variant = "page",
  onSuccess,
  onCancel,
}: PasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const titleKey = role === "admin" ? "auth_adminTitle" : "auth_staffTitle";
  const isPage = variant === "page";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await verifyPassword(role, password);
    setSubmitting(false);

    if (result.ok) {
      setUnlocked(role);
      setPassword("");
      onSuccess();
      return;
    }

    setError(t(language, "auth_invalidPassword"));
  }

  const form = (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div
        className={`rounded-2xl border bg-white shadow-xl ${
          isPage ? "border-slate-200 p-8 sm:p-10" : "border-slate-200 p-6 sm:p-8"
        }`}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2b4b]/10 text-[#1a2b4b]">
            <Lock className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            {t(language, titleKey)}
          </h2>
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-600">
          {t(language, "auth_passwordLabel")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          autoFocus
          className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-4 text-lg outline-none transition-colors focus:border-[#1a2b4b] focus:ring-2 focus:ring-[#1a2b4b]/10"
          placeholder="••••"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="min-h-[52px] flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
            >
              {t(language, "auth_cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !password}
            className="min-h-[52px] flex-1 rounded-xl bg-[#1a2b4b] px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#152238] active:bg-[#0f1a2e] disabled:opacity-50"
          >
            {submitting ? "..." : t(language, "auth_confirm")}
          </button>
        </div>
      </div>
    </form>
  );

  if (isPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 px-4 py-10">
        {form}
      </div>
    );
  }

  return form;
}
