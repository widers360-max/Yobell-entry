"use client";

import { Phone, QrCode } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import {
  MAIN_GRID_CARDS,
  OTHER_CARD,
  type VisitorPurposeCard,
} from "@/lib/visitor-cards";
import { t, visitorTypeLabel, purposeSubtitle } from "@/lib/i18n";
import type { KioskSettings, Language, VisitorType } from "@/lib/types";

interface KioskHomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: KioskSettings;
  onSelectPurpose: (type: VisitorType) => void;
}

export function KioskHomeScreen({
  language,
  onLanguageChange,
  settings,
  onSelectPurpose,
}: KioskHomeScreenProps) {
  const heroTitle = settings.heroTitle;
  const heroSubtitle = settings.heroSubtitle;
  const brandName = settings.brandName;

  return (
    <div className="kiosk-portrait flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between px-8 pb-4 pt-6">
        <div className="flex items-center gap-4">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={brandName}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--yobell-navy)] shadow-md">
                <span className="text-2xl font-black text-[var(--yobell-gold)]">Y</span>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight text-[var(--yobell-navy)]">
                  {brandName}
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

      {/* Hero */}
      <section className="shrink-0 px-8">
        <HeroMedia
          videoUrl={settings.heroVideoUrl}
          imageUrl={settings.heroImageUrl}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      {/* Purpose cards */}
      <section className="flex flex-1 flex-col px-8 pb-4 pt-6">
        <h2 className="mb-5 text-center text-2xl font-bold text-[var(--yobell-navy)]">
          {t(language, "selectVisitorType")}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {MAIN_GRID_CARDS.map((card) => (
            <PurposeCard
              key={card.type}
              card={card}
              language={language}
              onSelect={onSelectPurpose}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="w-1/3 min-w-[200px]">
            <PurposeCard
              card={OTHER_CARD}
              language={language}
              onSelect={onSelectPurpose}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="shrink-0">
        <div className="flex items-center gap-6 bg-[var(--yobell-cream)] px-8 py-5">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[var(--yobell-border)] bg-white">
              <QrCode className="h-8 w-8 text-[var(--yobell-navy)]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--yobell-navy)]">
                {t(language, "footerPreregister")}
              </p>
              <p className="text-sm text-[var(--yobell-muted)]">
                {t(language, "footerPreregisterSub")}
              </p>
            </div>
          </div>

          <div className="h-14 w-px bg-[var(--yobell-border)]" />

          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--yobell-navy)]">
              <Phone className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--yobell-navy)]">
                {t(language, "footerHelp")}
              </p>
              <p className="text-sm text-[var(--yobell-muted)]">
                {t(language, "footerHelpSub")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--yobell-navy)] py-3 text-center text-sm text-white/80">
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
}: {
  videoUrl: string | null;
  imageUrl: string | null;
  title: string;
  subtitle: string;
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
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--yobell-navy)] via-[#2a4570] to-[#1a3050]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,162,39,0.4),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
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
  language,
  onSelect,
}: {
  card: VisitorPurposeCard;
  language: Language;
  onSelect: (type: VisitorType) => void;
}) {
  const Icon = card.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(card.type)}
      className="purpose-card group flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--yobell-border)] bg-white p-4 shadow-[0_4px_16px_rgba(26,43,75,0.08)] transition-all duration-200 active:scale-[0.97] hover:border-[var(--yobell-gold)] hover:shadow-[0_8px_24px_rgba(26,43,75,0.14)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--yobell-navy)]/5 transition-colors group-hover:bg-[var(--yobell-navy)]/10">
        <Icon
          className="h-7 w-7 text-[var(--yobell-navy)]"
          strokeWidth={1.75}
        />
      </div>
      <span className="text-center text-lg font-bold leading-tight text-[var(--yobell-navy)]">
        {visitorTypeLabel(language, card.type)}
      </span>
      <span className="text-center text-xs leading-snug text-[var(--yobell-muted)]">
        {purposeSubtitle(language, card.subtitleKey)}
      </span>
    </button>
  );
}
