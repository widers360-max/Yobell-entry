"use client";

import { QrCode } from "lucide-react";
import { getIcon } from "@/lib/icon-utils";
import { getLangDisplay } from "@/lib/admin-i18n";
import {
  KIOSK_SHOWROOM_DEFAULTS,
  YOBELL_DEFAULT_ACCENT,
  YOBELL_DEFAULT_PRIMARY,
  poweredByLabel,
} from "@/lib/design-system";
import { useAdminI18n } from "./AdminI18nProvider";
import type { KioskSettings, VisitorCardRecord } from "@/lib/types";

export function KioskPreview({
  settings,
  cards,
}: {
  settings: Partial<KioskSettings>;
  cards: VisitorCardRecord[];
}) {
  const { lang, t } = useAdminI18n();
  const primary = settings.primaryColor ?? YOBELL_DEFAULT_PRIMARY;
  const accent = settings.accentColor ?? YOBELL_DEFAULT_ACCENT;
  const company =
    settings.companyDisplayName?.trim() || KIOSK_SHOWROOM_DEFAULTS.companyDisplayName;
  const welcomeLine = settings.heroTitle?.trim() || KIOSK_SHOWROOM_DEFAULTS.heroTitle;
  const heroSubtitle =
    settings.heroSubtitle?.trim() || KIOSK_SHOWROOM_DEFAULTS.heroSubtitle;
  const tagline = settings.tagline?.trim() || KIOSK_SHOWROOM_DEFAULTS.tagline;
  const activeCards = cards.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const mainCards = activeCards.filter((c) => c.typeKey !== "other").slice(0, 6);
  const otherCard = activeCards.find((c) => c.typeKey === "other");

  return (
    <div
      className="overflow-hidden rounded-2xl border border-yobell-border shadow-glass-lg"
      style={
        {
          "--yobell-navy": primary,
          "--yobell-gold": accent,
          "--preview-primary": primary,
          "--preview-accent": accent,
        } as React.CSSProperties
      }
    >
      <div className="bg-yobell-surface px-3 py-2 text-center text-xs font-medium text-yobell-muted">
        {t("branding_preview")}
      </div>
      <div className="flex flex-col bg-yobell-bg" style={{ minHeight: 520 }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="" className="h-8 w-auto" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-yobell-sm bg-yobell-navy text-sm font-black text-yobell-gold">
                Y
              </div>
            )}
            <span className="text-sm font-black text-yobell-navy">
              {settings.brandName ?? KIOSK_SHOWROOM_DEFAULTS.brandName}
            </span>
          </div>
          <div className="rounded-full border border-yobell-border bg-yobell-surface px-3 py-1 text-xs text-yobell-muted">
            {getLangDisplay(lang)} ▾
          </div>
        </div>

        <div className="relative mx-4 h-24 overflow-hidden rounded-yobell-sm shadow-glass">
          {settings.heroVideoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-yobell-navy text-xs text-white/60">
              {t("preview_video")}
            </div>
          ) : settings.heroImageUrl ? (
            <img src={settings.heroImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="kiosk-showroom-gradient absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-yobell-navy/85 via-yobell-navy/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-white">
            <p className="text-[8px] tracking-[0.2em] text-white/75 uppercase">{welcomeLine}</p>
            <p className="text-[11px] font-black leading-tight">{company}へ</p>
            <p className="mt-0.5 text-[8px] text-yobell-gold-light">{heroSubtitle}</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-3">
          <p className="mb-2 text-xs font-bold text-yobell-navy">{t("preview_selectPurpose")}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {mainCards.map((card) => {
              const Icon = getIcon(card.iconKey);
              return (
                <div
                  key={card.id}
                  className="flex flex-col items-center gap-1 rounded-yobell-sm border border-yobell-border bg-yobell-surface p-2 shadow-glass"
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ background: `${primary}12` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: primary }} strokeWidth={1.75} />
                  </div>
                  <span className="text-center text-[9px] font-bold leading-tight text-yobell-navy">
                    {card.title}
                  </span>
                  <span className="text-center text-[7px] leading-tight text-yobell-muted">
                    {card.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
          {otherCard && (
            <div className="mt-1.5 flex justify-center">
              <div className="w-1/3 rounded-yobell-sm border border-yobell-border bg-yobell-surface p-2 text-center shadow-glass">
                <span className="text-[9px] font-bold text-yobell-navy">{otherCard.title}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mx-4 mb-2 flex items-center gap-2 rounded-yobell-sm border border-yobell-border bg-yobell-surface px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-yobell-border">
            <QrCode className="h-4 w-4 text-yobell-navy" strokeWidth={1.5} />
          </div>
          <p className="text-[8px] font-bold text-yobell-navy">{t("preview_preregister")}</p>
        </div>

        <div className="bg-yobell-navy px-4 py-2 text-center text-white">
          <p className="text-[8px] font-medium text-white/90">{tagline}</p>
          <p className="mt-0.5 text-[7px] tracking-wide text-yobell-gold/90">
            {poweredByLabel(company)}
          </p>
        </div>
      </div>
    </div>
  );
}
