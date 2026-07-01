"use client";

import Link from "next/link";
import { Settings, Users } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";

interface KioskTopBarProps {
  language: Language;
}

export function KioskTopBar({ language }: KioskTopBarProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1 border-b border-slate-200/80 bg-slate-50/90 px-4 py-1.5 backdrop-blur-sm">
      <Link
        href="/admin"
        className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-[var(--yobell-navy,#1a2b4b)]"
      >
        <Settings className="h-3 w-3" strokeWidth={1.75} />
        {t(language, "nav_admin")}
      </Link>
      <span className="text-slate-300">·</span>
      <Link
        href="/staff"
        className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-[var(--yobell-navy,#1a2b4b)]"
      >
        <Users className="h-3 w-3" strokeWidth={1.75} />
        {t(language, "nav_staff")}
      </Link>
    </div>
  );
}
