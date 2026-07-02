"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  isActive: boolean;
  onActivate: () => void;
}

function companyShortName(name: string) {
  return name.replace(/^株式会社\s*/, "").trim() || name;
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
  const welcomeMessage =
    settings.welcomeMessage?.trim() || KIOSK_SHOWROOM_DEFAULTS.welcomeMessage;

  return { company, welcomeLine, heroSubtitle, tagline, brandName, welcomeMessage };
}

type IdleSlide = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  line?: string;
};

const SLIDE_INTERVAL_MS = 8_000;

export function KioskHomeScreen({
  language,
  onLanguageChange,
  settings,
  visitorCards,
  onSelectPurpose,
  isActive,
  onActivate,
}: KioskHomeScreenProps) {
  const [now, setNow] = useState(() => new Date());
  const [slideIndex, setSlideIndex] = useState(0);

  const primary = settings.primaryColor ?? YOBELL_DEFAULT_PRIMARY;
  const accent = settings.accentColor ?? YOBELL_DEFAULT_ACCENT;
  const copy = resolveShowroomCopy(settings);
  const shortCompany = companyShortName(copy.company);

  const activeCards = visitorCards
    .filter((c) => c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const mainCards = activeCards.filter((c) => c.typeKey !== "other").slice(0, 6);
  const otherCard = activeCards.find((c) => c.typeKey === "other");

  const idleSlides = useMemo<IdleSlide[]>(
    () => [
      {
        eyebrow: t(language, "idle_welcomeTo"),
        title: shortCompany,
        subtitle: t(language, "idle_smartReception"),
        line: copy.welcomeMessage,
      },
      {
        eyebrow: copy.welcomeLine,
        title: copy.company,
        subtitle: copy.heroSubtitle,
        line: copy.welcomeMessage,
      },
      {
        eyebrow: copy.brandName,
        title: t(language, "idle_smartReception"),
        subtitle: copy.tagline,
        line: copy.welcomeMessage,
      },
    ],
    [language, shortCompany, copy],
  );

  const cssVars = {
    "--yobell-navy": primary,
    "--yobell-gold": accent,
    "--yobell-primary": primary,
    "--yobell-accent": accent,
  } as React.CSSProperties;

  useEffect(() => {
    const interval = isActive ? 30_000 : 1_000;
    const timer = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (isActive) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % idleSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isActive, idleSlides.length]);

  const activate = useCallback(() => {
    onActivate();
  }, [onActivate]);

  const dateLabel = now.toLocaleDateString(
    language === "ko" ? "ko-KR" : language === "en" ? "en-US" : "ja-JP",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    },
  );
  const timeLabel = now.toLocaleTimeString(
    language === "ko" ? "ko-KR" : language === "en" ? "en-US" : "ja-JP",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  if (!isActive) {
    const slide = idleSlides[slideIndex] ?? idleSlides[0];

    return (
      <div
        className="kiosk-idle-showroom kiosk-portrait relative flex min-h-screen flex-col overflow-hidden"
        style={cssVars}
        role="button"
        tabIndex={0}
        onPointerDown={activate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") activate();
        }}
      >
        <KioskTopBar language={language} />

        <HeroBackdrop
          videoUrl={settings.heroVideoUrl}
          imageUrl={settings.heroImageUrl}
          primary={primary}
          accent={accent}
        />

        <div className="kiosk-idle-showroom-overlay absolute inset-0 bg-gradient-to-t from-yobell-navy/90 via-yobell-navy/45 to-yobell-navy/25" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <header className="flex shrink-0 items-start justify-between px-g4 pt-g3">
            <div className="flex min-w-0 items-center gap-g2">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={copy.brandName}
                  className="h-14 w-auto max-w-[220px] object-contain drop-shadow-lg"
                />
              ) : (
                <div className="flex items-center gap-g2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-yobell-sm bg-white/10 shadow-glass backdrop-blur-sm">
                    <span className="text-2xl font-black text-yobell-gold">Y</span>
                  </div>
                  <div className="min-w-0 text-white">
                    <p className="truncate text-lg font-black tracking-tight">{copy.brandName}</p>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-white/70">
                      {t(language, "smartReception")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-3xl font-black tabular-nums tracking-tight text-white drop-shadow-lg">
                {timeLabel}
              </p>
              <p className="mt-1 text-sm font-medium text-white/80">{dateLabel}</p>
            </div>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center px-g4 text-center text-white">
            <div key={slideIndex} className="kiosk-idle-slide kiosk-idle-welcome max-w-2xl">
              {slide.eyebrow && (
                <p className="text-sm font-semibold tracking-[0.35em] text-white/75 uppercase">
                  {slide.eyebrow}
                </p>
              )}
              <h1 className="mt-g2 text-5xl font-black leading-tight tracking-tight drop-shadow-xl md:text-6xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-g3 text-xl font-medium tracking-wide text-yobell-gold-light drop-shadow md:text-2xl">
                  {slide.subtitle}
                </p>
              )}
              {slide.line && (
                <p className="mt-g4 text-lg font-medium text-white/90 md:text-xl">{slide.line}</p>
              )}
            </div>

            <div className="mt-g4 flex gap-2">
              {idleSlides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-slow ${
                    i === slideIndex ? "w-8 bg-yobell-gold" : "w-1.5 bg-white/35"
                  }`}
                />
              ))}
            </div>
          </div>

          <footer className="shrink-0 px-g4 pb-g4 pt-g2 text-center">
            <p className="kiosk-idle-touch-hint inline-block rounded-full border border-white/25 bg-white/10 px-g4 py-g2 text-base font-medium text-white/95 backdrop-blur-sm">
              {t(language, "home_touchHint")}
            </p>
            <p className="mt-g2 text-xs tracking-wide text-white/50">
              {poweredByLabel(copy.company)}
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div
      className="kiosk-portrait kiosk-active-enter relative flex min-h-screen flex-col overflow-hidden bg-yobell-bg"
      style={cssVars}
    >
      <KioskTopBar language={language} />

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
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold tabular-nums text-yobell-navy">{timeLabel}</p>
            <p className="text-[11px] text-yobell-muted">{dateLabel}</p>
          </div>
          <LanguageToggle
            language={language}
            onChange={onLanguageChange}
            variant="premium"
          />
        </div>
      </header>

      <section className="relative shrink-0 px-g3 pb-g1 transition-all duration-slow ease-yobell">
        <div className="relative h-[200px] w-full overflow-hidden rounded-yobell shadow-glass-lg">
          <HeroBackdrop
            videoUrl={settings.heroVideoUrl}
            imageUrl={settings.heroImageUrl}
            primary={primary}
            accent={accent}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-yobell-navy/85 via-yobell-navy/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-g4 text-center text-white">
            <p className="text-sm font-medium tracking-[0.35em] text-white/75 uppercase">
              {copy.welcomeLine}
            </p>
            <h1 className="mt-g2 text-3xl font-black leading-tight tracking-tight drop-shadow-lg">
              {copy.company}
              {language === "ja" ? t(language, "home_companySuffix") : ""}
            </h1>
            <p className="mt-g2 text-base font-medium tracking-wide text-yobell-gold-light drop-shadow">
              {copy.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

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

      <footer className="shrink-0">
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
