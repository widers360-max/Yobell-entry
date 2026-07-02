/**
 * YOBELL Design System — single source of truth for brand tokens.
 * Tailwind theme mirrors these values in tailwind.config.ts / globals.css.
 */
export const YOBELL_COLORS = {
  navy: "#11284A",
  navyDark: "#0D1F38",
  navyLight: "#1A3860",
  gold: "#C8A246",
  goldHover: "#B8923D",
  goldLight: "#E0C06A",
  background: "#F7F6F3",
  surface: "#FFFFFF",
  success: "#1F8A4C",
  danger: "#D64545",
  text: "#11284A",
  textMuted: "#5C6B7A",
  border: "#E5E2DC",
} as const;

export const YOBELL_RADIUS = {
  DEFAULT: "24px",
  sm: "12px",
  lg: "32px",
} as const;

export const YOBELL_DURATION = {
  fast: "200ms",
  normal: "300ms",
  slow: "500ms",
} as const;

export const YOBELL_GRID = 8;

export const YOBELL_DEFAULT_PRIMARY = YOBELL_COLORS.navy;
export const YOBELL_DEFAULT_ACCENT = YOBELL_COLORS.gold;

/** Showroom / kiosk defaults when admin settings are empty */
export const KIOSK_SHOWROOM_DEFAULTS = {
  brandName: "YOBELL",
  companyDisplayName: "株式会社WIDERS",
  welcomeLine: "ようこそ",
  heroTitle: "ようこそ",
  heroSubtitle: "Smart Reception by YOBELL",
  tagline: "内線電話のないオフィス受付",
  welcomeMessage: "ご来社ありがとうございます",
} as const;

export function poweredByLabel(companyDisplayName: string): string {
  const short = companyDisplayName.replace(/^株式会社\s*/, "").trim() || "WIDERS";
  return `Powered by ${short}`;
}
