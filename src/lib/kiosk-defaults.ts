import type { KioskSettings } from "@/lib/types";
import {
  KIOSK_SHOWROOM_DEFAULTS,
  YOBELL_DEFAULT_ACCENT,
  YOBELL_DEFAULT_PRIMARY,
} from "@/lib/design-system";

/** Shared kiosk settings defaults for kiosk page and admin console. */
export const DEFAULT_KIOSK_SETTINGS: KioskSettings = {
  brandName: KIOSK_SHOWROOM_DEFAULTS.brandName,
  tagline: KIOSK_SHOWROOM_DEFAULTS.tagline,
  logoUrl: null,
  welcomeMessage: KIOSK_SHOWROOM_DEFAULTS.welcomeMessage,
  languageDefault: "ja",
  fallbackMessage:
    "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
  privacyNotice:
    "入力された情報は受付対応および来訪記録のために利用されます。",
  heroImageUrl: null,
  heroVideoUrl: null,
  companyDisplayName: KIOSK_SHOWROOM_DEFAULTS.companyDisplayName,
  heroTitle: KIOSK_SHOWROOM_DEFAULTS.heroTitle,
  heroSubtitle: KIOSK_SHOWROOM_DEFAULTS.heroSubtitle,
  primaryColor: YOBELL_DEFAULT_PRIMARY,
  accentColor: YOBELL_DEFAULT_ACCENT,
  retentionDays: 30,
  idleTimeoutSeconds: KIOSK_SHOWROOM_DEFAULTS.idleTimeoutSeconds,
};

export function mergeKioskSettings(
  partial: Partial<KioskSettings> | null | undefined,
): KioskSettings {
  return { ...DEFAULT_KIOSK_SETTINGS, ...partial };
}
