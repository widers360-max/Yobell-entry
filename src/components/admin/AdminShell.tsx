"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Palette,
  Building2,
  Users,
  ClipboardList,
  Grid3x3,
  Settings,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export type AdminSection =
  | "dashboard"
  | "branding"
  | "companies"
  | "staff"
  | "visits"
  | "cards"
  | "system";

const NAV: { key: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { key: "branding", label: "キオスクブランディング", icon: Palette },
  { key: "companies", label: "会社管理", icon: Building2 },
  { key: "staff", label: "スタッフ管理", icon: Users },
  { key: "visits", label: "来訪ログ", icon: ClipboardList },
  { key: "cards", label: "用件カード設定", icon: Grid3x3 },
  { key: "system", label: "システム設定", icon: Settings },
];

export function AdminShell({
  section,
  onSectionChange,
  children,
}: {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-[#1a2b4b] text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xl font-black tracking-tight">YOBELL</p>
          <p className="text-xs font-medium text-white/50">Admin Console v0.3</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ key, label, icon: Icon }) => (
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
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          <QuickLink href="/" label="キオスクを開く" />
          <QuickLink href="/staff" label="スタッフ通知" />
          <QuickLink href="/health" label="ヘルスチェック" />
        </div>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur">
          <h1 className="text-lg font-bold text-slate-800">
            {NAV.find((n) => n.key === section)?.label}
          </h1>
        </header>
        <main className="flex-1 p-8">{children}</main>
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
