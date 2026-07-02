"use client";

import { useState, useEffect, useCallback } from "react";
import { QrCode } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { KioskTopBar } from "./KioskTopBar";
import { getIcon } from "@/lib/icon-utils";
import { t } from "@/lib/i18n";
import { PremiumCard } from "@/components/kiosk";
import {
  KIOSK_SHOWROOM_DEFAULTS,
  YOBELL_DEFAULT_ACCENT,
  YOBELL_DEFAULT_PRIMARY,
  poweredByLabel,
} from "@/lib/design-system";
import type { KioskSettings, Language, VisitorCardRecord, VisitorType } from "@/lib/types";

interface KioskHomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: KioskSettings;
  visitorCards: VisitorCardRecord[];
  onSelectPurpose: (type: VisitorType) => void;
}

function resolveShowroomCopy(settings: KioskSettings) {
  const company =
    settings.companyDisplayName?.trim() || KIOSK_SHOWROOM_DEFAULTS.companyDisplayName;
  const welcomeLine =
    settings.heroTitle?.trim() || KIOSK_SHOWROOM_DEFAULTS.heroTitle;
  const heroSubtitle =
    settings.heroSubtitle?.trim() || KIOSK_SHOWROOM_DEFAULTS.heroSubtitle;
  const tagline = settings.tagline?.trim() || KIOSK_SHOWROOM_DEFAULTS.tagline;
  const brandName = settings.brandName?.trim() || KIOSK_SHOWROOM_DEFAULTS.brandName;

  return { company, welcomeLine, heroSubtitle, tagline, brandName };
}

export function KioskHomeScreen({
  language,
  onLanguageChange,
  settings,
  visitorCards,
  onSelectPurpose,
}: KioskHomeScreenProps) {
  const [isActive, setIsActive] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const primary = settings.primaryColor ?? YOBELL_DEFAULT_PRIMARY;
  const accent = settings.accentColor ?? YOBELL_DEFAULT_ACCENT;
  const copy = resolveShowroomCopy(settings);

  const activeCards = visitorCards
    .filter((c) => c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const mainCards = activeCards.filter((c) => c.typeKey !== "other").slice(0, 6);
  const otherCard = activeCards.find((c) => c.typeKey === "other");

  const cssVars = {
    "--yobell-navy": primary,
    "--yobell-gold": accent,
    "--yobell-primary": primary,
    "--yobell-accent": accent,
  } as React.CSSProperties;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const dateLabel = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeLabel = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="kiosk-portrait relative flex min-h-screen flex-col overflow-hidden bg-yobell-bg"
      style={cssVars}
    >
      <KioskTopBar language={language} />

      {/* Header */}
      <header className="flex shrink-0 items-center justify-between px-g3 pb-g1 pt-g2">
        <div className="flex min-w-0 items-center gap-g2">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={copy.brandName}
              className="h-12 w-auto max-w-[200px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-g2">
              <div className="flex h-11 w-11 items-center justify-center rounded-yobell-sm bg-yobell-navy shadow-glass">
                <span className="text-xl font-black text-yobell-gold">Y</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-black tracking-tight text-yobell-navy">
                  {copy.brandName}
                </p>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-yobell-muted">
                  {t(language, "smartReception")}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-g2">
          {isActive && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold tabular-nums text-yobell-navy">{timeLabel}</p>
              <p className="text-[11px] text-yobell-muted">{dateLabel}</p>
            </div>
          )}
          <LanguageToggle
            language={language}
            onChange={onLanguageChange}
            variant="premium"
          />
        </div>
      </header>

      {/* Hero / Welcome */}
      <section
        className={`relative shrink-0 px-g3 transition-all duration-slow ease-yobell ${
          isActive ? "pb-g1" : "flex-1 pb-0"
        }`}
      >
        <div
          role={isActive ? undefined : "button"}
          tabIndex={isActive ? undefined : 0}
          onClick={!isActive ? activate : undefined}
          onKeyDown={
            !isActive
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") activate();
                }
              : undefined
          }
          className={`relative w-full overflow-hidden rounded-yobell shadow-glass-lg transition-all duration-slow ease-yobell ${
            isActive ? "h-[200px]" : "h-full min-h-[420px] cursor-pointer"
          }`}
        >
          <HeroBackdrop
            videoUrl={settings.heroVideoUrl}
            imageUrl={settings.heroImageUrl}
            primary={primary}
            accent={accent}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-yobell-navy/85 via-yobell-navy/35 to-transparent" />

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-g4 text-center text-white ${
              !isActive ? "kiosk-idle-welcome" : ""
            }`}
          >
            <p className="text-sm font-medium tracking-[0.35em] text-white/75 uppercase">
              {copy.welcomeLine}
            </p>
            <h1 className="mt-g2 text-4xl font-black leading-tight tracking-tight drop-shadow-lg md:text-5xl">
              {copy.company}
              {language === "ja" ? t(language, "home_companySuffix") : ""}
            </h1>
            <p className="mt-g2 text-lg font-medium tracking-wide text-yobell-gold-light drop-shadow">
              {copy.heroSubtitle}
            </p>

            {!isActive && (
              <p className="mt-g4 rounded-full border border-white/25 bg-white/10 px-g3 py-g1 text-sm font-medium text-white/90 backdrop-blur-sm">
                {t(language, "home_touchHint")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Purpose selection — revealed in active mode */}
      {isActive && (
        <section className="kiosk-reveal-panel flex min-h-0 flex-1 flex-col px-g3 pb-g1 pt-g2">
          <div className="mb-g2 flex items-end justify-between gap-g2">
            <h2 className="text-xl font-bold text-yobell-navy">
              {t(language, "selectVisitorType")}
            </h2>
            <div className="text-right sm:hidden">
              <p className="text-sm font-semibold tabular-nums text-yobell-navy">{timeLabel}</p>
              <p className="text-[10px] text-yobell-muted">{dateLabel}</p>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-g2 content-start">
            {mainCards.map((card) => {
              const Icon = getIcon(card.iconKey);
              return (
                <PremiumCard
                  key={card.id}
                  layout="vertical"
                  title={card.title}
                  subtitle={card.subtitle}
                  icon={Icon}
                  primaryColor={primary}
                  onClick={() => onSelectPurpose(card.typeKey as VisitorType)}
                />
              );
            })}
          </div>

          {otherCard && (
            <div className="mt-g2 flex justify-center">
              <div className="w-1/3 min-w-[180px]">
                <PremiumCard
                  layout="vertical"
                  title={otherCard.title}
                  subtitle={otherCard.subtitle}
                  icon={getIcon(otherCard.iconKey)}
                  primaryColor={primary}
                  onClick={() => onSelectPurpose(otherCard.typeKey as VisitorType)}
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer utility */}
      <footer
        className={`shrink-0 transition-all duration-slow ease-yobell ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="yobell-glass mx-g3 mb-g1 flex items-center gap-g2 rounded-yobell-sm border border-yobell-border px-g2 py-g2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-yobell-sm border-2 border-dashed border-yobell-border bg-yobell-surface">
            <QrCode className="h-7 w-7 text-yobell-navy" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-yobell-navy">
              {t(language, "footerPreregister")}
            </p>
            <p className="text-xs text-yobell-muted">{t(language, "footerPreregisterSub")}</p>
          </div>
        </div>

        <div className="bg-yobell-navy px-g3 py-g2 text-center">
          <p className="text-sm font-medium text-white/90">{copy.tagline}</p>
          <p className="mt-0.5 text-xs tracking-wide text-yobell-gold/90">
            {poweredByLabel(copy.company)}
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroBackdrop({
  videoUrl,
  imageUrl,
  primary,
  accent,
}: {
  videoUrl: string | null;
  imageUrl: string | null;
  primary: string;
  accent: string;
}) {
  if (videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoUrl} />
      </video>
    );
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="kiosk-showroom-gradient absolute inset-0">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, ${accent}55, transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 20% 80%, ${primary}, transparent 50%)`,
        }}
      />
    </div>
  );
}
