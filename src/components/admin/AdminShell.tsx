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
import { KIOSK_SHOWROOM_DEFAULTS } from "@/lib/design-system";

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
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">W</div>
          <div>
            <p className="admin-brand-title">YOBELL</p>
            <p className="admin-brand-subtitle">{KIOSK_SHOWROOM_DEFAULTS.companyDisplayName}</p>
            <p className="admin-brand-console">{t("adminConsole")}</p>
          </div>
        </div>

        <div className="admin-sidebar-tools">
          <LanguageToggle language={lang} onChange={setLang} variant="premium" />
          <button type="button" onClick={handleLogout} className="admin-sidebar-logout">
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            {t("auth_logout")}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {ADMIN_NAV_KEYS.map((key) => {
            const Icon = NAV_ICONS[key];
            const active = section === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSectionChange(key)}
                className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{t(ADMIN_NAV_I18N[key])}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <QuickLink href="/" label={t("link_kiosk")} />
          <QuickLink href="/staff" label={t("link_staffNotify")} />
          <QuickLink href="/health" label={t("link_health")} />
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-eyebrow">YOBELL Admin</p>
            <h1 className="admin-topbar-title">{t(ADMIN_NAV_I18N[section])}</h1>
          </div>
        </header>
        <main className="admin-content">
          <div key={section} className="admin-section-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} target="_blank" className="admin-quick-link">
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
