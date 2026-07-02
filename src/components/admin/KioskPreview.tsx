"use client";

import { getIcon } from "@/lib/icon-utils";
import { getLangDisplay } from "@/lib/admin-i18n";
import { YOBELL_DEFAULT_ACCENT, YOBELL_DEFAULT_PRIMARY } from "@/lib/design-system";
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
  const activeCards = cards.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const mainCards = activeCards.filter((c) => c.typeKey !== "other").slice(0, 6);
  const otherCard = activeCards.find((c) => c.typeKey === "other");

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg"
      style={{ "--preview-primary": primary, "--preview-accent": accent } as React.CSSProperties}
    >
      <div className="bg-slate-100 px-3 py-2 text-center text-xs font-medium text-slate-500">
        {t("branding_preview")}
      </div>
      <div className="flex flex-col bg-white" style={{ minHeight: 480 }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="" className="h-8 w-auto" />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
                style={{ background: primary }}
              >
                Y
              </div>
            )}
            <span className="text-sm font-black" style={{ color: primary }}>
              {settings.brandName ?? "YOBELL"}
            </span>
          </div>
          <div className="rounded-full border px-3 py-1 text-xs text-slate-500">
            {getLangDisplay(lang)} ▾
          </div>
        </div>

        <div className="relative mx-4 h-28 overflow-hidden rounded-xl">
          {settings.heroVideoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-xs text-white/60">
              {t("preview_video")}
            </div>
          ) : settings.heroImageUrl ? (
            <img src={settings.heroImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${primary}, #2a4570)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs font-bold leading-tight text-white">
              {settings.heroTitle ?? "ようこそ、株式会社YOBELLへ"}
            </p>
            <p className="mt-0.5 text-[10px] text-white/80">
              {settings.heroSubtitle ?? "快適なオフィス環境を、すべての人に。"}
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 py-3">
          <p className="mb-2 text-center text-xs font-bold" style={{ color: primary }}>
            {t("preview_selectPurpose")}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {mainCards.map((card) => {
              const Icon = getIcon(card.iconKey);
              return (
                <div
                  key={card.id}
                  className="flex flex-col items-center gap-1 rounded-lg border border-slate-100 bg-white p-2 shadow-sm"
                >
                  <Icon className="h-4 w-4" style={{ color: primary }} strokeWidth={1.75} />
                  <span
                    className="text-center text-[9px] font-bold leading-tight"
                    style={{ color: primary }}
                  >
                    {card.title}
                  </span>
                  <span className="text-center text-[7px] leading-tight text-slate-400">
                    {card.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
          {otherCard && (
            <div className="mt-1.5 flex justify-center">
              <div className="w-1/3 rounded-lg border border-slate-100 bg-white p-2 text-center shadow-sm">
                <span className="text-[9px] font-bold" style={{ color: primary }}>
                  {otherCard.title}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className="border-t px-4 py-2 text-center text-[8px] text-white"
          style={{ background: primary }}
        >
          © {settings.companyDisplayName ?? "YOBELL Co., Ltd."}
        </div>
      </div>
    </div>
  );
}
