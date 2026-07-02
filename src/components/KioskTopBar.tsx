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
      <div className="flex shrink-0 items-center justify-end gap-1 border-b border-yobell-border/80 bg-yobell-bg/90 px-g2 py-g1 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setModalRole("admin")}
          className="flex items-center gap-1 rounded-yobell-sm px-g2 py-g1 text-xs font-medium text-yobell-muted transition-colors duration-fast hover:bg-yobell-surface hover:text-yobell-navy"
        >
          <Settings className="h-3 w-3" strokeWidth={1.75} />
          {t(language, "nav_admin")}
        </button>
        <span className="text-slate-300">·</span>
        <button
          type="button"
          onClick={() => setModalRole("staff")}
          className="flex items-center gap-1 rounded-yobell-sm px-g2 py-g1 text-xs font-medium text-yobell-muted transition-colors duration-fast hover:bg-yobell-surface hover:text-yobell-navy"
        >
          <Users className="h-3 w-3" strokeWidth={1.75} />
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
