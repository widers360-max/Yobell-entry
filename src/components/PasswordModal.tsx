"use client";

import { useEffect } from "react";
import { PasswordPrompt } from "./PasswordPrompt";
import type { AuthRole } from "@/lib/auth-session";
import type { Language } from "@/lib/types";

interface PasswordModalProps {
  role: AuthRole;
  open: boolean;
  language?: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export function PasswordModal({
  role,
  open,
  language = "ja",
  onClose,
  onSuccess,
}: PasswordModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <PasswordPrompt
          role={role}
          language={language}
          variant="modal"
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
