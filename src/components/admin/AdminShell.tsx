"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Building2,
  Users,
  ClipboardList,
  Grid3x3,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAdminI18n } from "./AdminI18nProvider";
import { ADMIN_NAV_I18N, ADMIN_NAV_KEYS } from "@/lib/admin-i18n";
import { clearUnlock } from "@/lib/auth-session";

export type AdminSection =
  | "dashboard"
  | "branding"
  | "companies"
  | "staff"
  | "visits"
  | "cards"
  | "notification"
  | "system";

const NAV_ICONS = {
  dashboard: LayoutDashboard,
  branding: Palette,
  companies: Building2,
  staff: Users,
  visits: ClipboardList,
  cards: Grid3x3,
  notification: Mail,
  system: Settings,
};

export function AdminShell({
  section,
  onSectionChange,
  children,
}: {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  children: ReactNode;
}) {
  const router = useRouter();
  const { lang, setLang, t } = useAdminI18n();

  function handleLogout() {
    clearUnlock("admin");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-yobell-bg">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-yobell-border bg-yobell-navy text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xl font-black tracking-tight">YOBELL</p>
              <p className="text-xs font-medium text-white/50">{t("adminConsole")}</p>
            </div>
          </div>
          <div className="mt-3 scale-90 origin-left">
            <LanguageToggle language={lang} onChange={setLang} variant="premium" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("auth_logout")}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_KEYS.map((key) => {
            const Icon = NAV_ICONS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSectionChange(key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  section === key
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {t(ADMIN_NAV_I18N[key])}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          <QuickLink href="/" label={t("link_kiosk")} />
          <QuickLink href="/staff" label={t("link_staffNotify")} />
          <QuickLink href="/health" label={t("link_health")} />
        </div>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-yobell-border bg-yobell-surface/90 px-g4 py-g2 backdrop-blur">
          <h1 className="text-lg font-bold text-yobell-text">
            {t(ADMIN_NAV_I18N[section])}
          </h1>
        </header>
        <main className="flex-1 bg-yobell-bg p-g4">{children}</main>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
