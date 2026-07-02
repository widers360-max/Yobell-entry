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
        className={`yobell-card-premium ${
          isPage ? "p-g4 sm:p-g5" : "p-g3 sm:p-g4"
        }`}
      >
        <div className="mb-g3 flex flex-col items-center text-center">
          <div className="mb-g2 flex h-14 w-14 items-center justify-center rounded-yobell-sm bg-yobell-navy/10 text-yobell-navy">
            <Lock className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h2 className="text-xl font-bold text-yobell-text sm:text-2xl">
            {t(language, titleKey)}
          </h2>
        </div>

        <label className="mb-g1 block text-sm font-semibold text-yobell-muted">
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
          className="admin-input mb-g2 w-full py-g2 text-lg"
          placeholder="••••"
        />

        {error && (
          <p className="mb-g2 rounded-yobell-sm bg-yobell-danger/10 px-g2 py-g2 text-sm font-medium text-yobell-danger">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-g2 sm:flex-row">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="yobell-btn-md yobell-btn-secondary min-h-[52px] flex-1"
            >
              {t(language, "auth_cancel")}
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !password}
            className="yobell-btn-md yobell-btn-primary min-h-[52px] flex-1 disabled:opacity-50"
          >
            {submitting ? "..." : t(language, "auth_confirm")}
          </button>
        </div>
      </div>
    </form>
  );

  if (isPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yobell-bg px-g2 py-g5">
        {form}
      </div>
    );
  }

  return form;
}
