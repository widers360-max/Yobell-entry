"use client";

import { Phone, QrCode } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { KioskTopBar } from "./KioskTopBar";
import { getIcon } from "@/lib/icon-utils";
import { t } from "@/lib/i18n";
import type { KioskSettings, Language, VisitorCardRecord, VisitorType } from "@/lib/types";

interface KioskHomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: KioskSettings;
  visitorCards: VisitorCardRecord[];
  onSelectPurpose: (type: VisitorType) => void;
}

export function KioskHomeScreen({
  language,
  onLanguageChange,
  settings,
  visitorCards,
  onSelectPurpose,
}: KioskHomeScreenProps) {
  const primary = settings.primaryColor ?? "#1a2b4b";
  const accent = settings.accentColor ?? "#c9a227";

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

  return (
    <div
      className="kiosk-portrait flex min-h-screen flex-col bg-white"
      style={cssVars}
    >
      <KioskTopBar language={language} />
      <header className="flex shrink-0 items-center justify-between px-8 pb-4 pt-6">
        <div className="flex items-center gap-4">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.brandName}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl shadow-md"
                style={{ background: primary }}
              >
                <span className="text-2xl font-black" style={{ color: accent }}>
                  Y
                </span>
              </div>
              <div>
                <p
                  className="text-3xl font-black tracking-tight"
                  style={{ color: primary }}
                >
                  {settings.brandName}
                </p>
                <p className="text-xs font-semibold tracking-[0.2em] text-[var(--yobell-muted)]">
                  {t(language, "smartReception")}
                </p>
              </div>
            </div>
          )}
        </div>
        <LanguageToggle
          language={language}
          onChange={onLanguageChange}
          variant="premium"
        />
      </header>

      <section className="shrink-0 px-8">
        <HeroMedia
          videoUrl={settings.heroVideoUrl}
          imageUrl={settings.heroImageUrl}
          title={settings.heroTitle}
          subtitle={settings.heroSubtitle}
          primary={primary}
          accent={accent}
        />
      </section>

      <section className="flex flex-1 flex-col px-8 pb-4 pt-6">
        <h2
          className="mb-5 text-center text-2xl font-bold"
          style={{ color: primary }}
        >
          {t(language, "selectVisitorType")}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {mainCards.map((card) => (
            <PurposeCard
              key={card.id}
              card={card}
              primary={primary}
              accent={accent}
              onSelect={onSelectPurpose}
            />
          ))}
        </div>

        {otherCard && (
          <div className="mt-4 flex justify-center">
            <div className="w-1/3 min-w-[200px]">
              <PurposeCard
                card={otherCard}
                primary={primary}
                accent={accent}
                onSelect={onSelectPurpose}
              />
            </div>
          </div>
        )}
      </section>

      <footer className="shrink-0">
        <div className="flex items-center gap-6 bg-[var(--yobell-cream)] px-8 py-5">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[var(--yobell-border)] bg-white">
              <QrCode className="h-8 w-8" style={{ color: primary }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: primary }}>
                {t(language, "footerPreregister")}
              </p>
              <p className="text-sm text-[var(--yobell-muted)]">
                {t(language, "footerPreregisterSub")}
              </p>
            </div>
          </div>

          <div className="h-14 w-px bg-[var(--yobell-border)]" />

          <div className="flex flex-1 items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{ background: primary }}
            >
              <Phone className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: primary }}>
                {t(language, "footerHelp")}
              </p>
              <p className="text-sm text-[var(--yobell-muted)]">
                {t(language, "footerHelpSub")}
              </p>
            </div>
          </div>
        </div>

        <div
          className="py-3 text-center text-sm text-white/80"
          style={{ background: primary }}
        >
          © {settings.companyDisplayName}
        </div>
      </footer>
    </div>
  );
}

function HeroMedia({
  videoUrl,
  imageUrl,
  title,
  subtitle,
  primary,
  accent,
}: {
  videoUrl: string | null;
  imageUrl: string | null;
  title: string;
  subtitle: string;
  primary: string;
  accent: string;
}) {
  return (
    <div className="relative h-[280px] overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(26,43,75,0.18)]">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} />
        </video>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${primary}, #2a4570)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${accent}66, transparent 60%)`,
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 text-lg text-white/90 drop-shadow">{subtitle}</p>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
        <span className="h-2 w-2 rounded-full bg-white/40" />
      </div>
    </div>
  );
}

function PurposeCard({
  card,
  primary,
  accent,
  onSelect,
}: {
  card: VisitorCardRecord;
  primary: string;
  accent: string;
  onSelect: (type: VisitorType) => void;
}) {
  const Icon = getIcon(card.iconKey);

  return (
    <button
      type="button"
      onClick={() => onSelect(card.typeKey as VisitorType)}
      className="group flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--yobell-border)] bg-white p-4 shadow-[0_4px_16px_rgba(26,43,75,0.08)] transition-all duration-200 active:scale-[0.97] hover:shadow-[0_8px_24px_rgba(26,43,75,0.14)]"
      style={{ ["--hover-border" as string]: accent }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
        style={{ background: `${primary}0d` }}
      >
        <Icon className="h-7 w-7" style={{ color: primary }} strokeWidth={1.75} />
      </div>
      <span
        className="text-center text-lg font-bold leading-tight"
        style={{ color: primary }}
      >
        {card.title}
      </span>
      <span className="text-center text-xs leading-snug text-[var(--yobell-muted)]">
        {card.subtitle}
      </span>
    </button>
  );
}
