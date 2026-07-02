"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Users } from "lucide-react";
import { t } from "@/lib/i18n";
import { PasswordModal } from "./PasswordModal";
import type { AuthRole } from "@/lib/auth-session";
import type { Language } from "@/lib/types";

interface KioskTopBarProps {
  language: Language;
}

export function KioskTopBar({ language }: KioskTopBarProps) {
  const router = useRouter();
  const [modalRole, setModalRole] = useState<AuthRole | null>(null);

  function handleSuccess() {
    const role = modalRole;
    setModalRole(null);
    if (role === "admin") router.push("/admin");
    if (role === "staff") router.push("/staff");
  }

  return (
    <>
      <div className="kiosk-topbar flex shrink-0 items-center justify-end gap-g1 border-b border-yobell-border/80 bg-yobell-bg/90 px-g2 py-g1 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setModalRole("admin")}
          className="kiosk-topbar-btn flex min-h-12 items-center gap-g1 rounded-yobell-sm px-g2 text-sm font-semibold text-yobell-muted transition-colors duration-fast hover:bg-yobell-surface hover:text-yobell-navy"
          aria-label={t(language, "nav_admin")}
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          {t(language, "nav_admin")}
        </button>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <button
          type="button"
          onClick={() => setModalRole("staff")}
          className="kiosk-topbar-btn flex min-h-12 items-center gap-g1 rounded-yobell-sm px-g2 text-sm font-semibold text-yobell-muted transition-colors duration-fast hover:bg-yobell-surface hover:text-yobell-navy"
          aria-label={t(language, "nav_staff")}
        >
          <Users className="h-4 w-4" strokeWidth={1.75} />
          {t(language, "nav_staff")}
        </button>
      </div>

      <PasswordModal
        role={modalRole ?? "admin"}
        open={modalRole !== null}
        language={language}
        onClose={() => setModalRole(null)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
