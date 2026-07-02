import type { Config } from "tailwindcss";
import { YOBELL_COLORS, YOBELL_RADIUS } from "./src/lib/design-system";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yobell: {
          navy: {
            DEFAULT: YOBELL_COLORS.navy,
            dark: YOBELL_COLORS.navyDark,
            light: YOBELL_COLORS.navyLight,
          },
          gold: {
            DEFAULT: YOBELL_COLORS.gold,
            hover: YOBELL_COLORS.goldHover,
            light: YOBELL_COLORS.goldLight,
          },
          bg: YOBELL_COLORS.background,
          surface: YOBELL_COLORS.surface,
          success: YOBELL_COLORS.success,
          danger: YOBELL_COLORS.danger,
          text: YOBELL_COLORS.text,
          muted: YOBELL_COLORS.textMuted,
          border: YOBELL_COLORS.border,
          // Legacy aliases used by CSS variables & kiosk dynamic branding
          primary: YOBELL_COLORS.navy,
          accent: YOBELL_COLORS.gold,
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-jp)",
          "Hiragino Sans",
          "Yu Gothic",
          "system-ui",
          "sans-serif",
        ],
        jp: ["var(--font-noto-sans-jp)", "Hiragino Sans", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        g1: "8px",
        g2: "16px",
        g3: "24px",
        g4: "32px",
        g5: "40px",
        g6: "48px",
        g8: "64px",
        g10: "80px",
        g12: "96px",
      },
      borderRadius: {
        yobell: YOBELL_RADIUS.DEFAULT,
        "yobell-sm": YOBELL_RADIUS.sm,
        "yobell-lg": YOBELL_RADIUS.lg,
      },
      boxShadow: {
        glass:
          "0 4px 24px rgba(17, 40, 74, 0.06), 0 1px 3px rgba(17, 40, 74, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.72)",
        "glass-lg":
          "0 8px 40px rgba(17, 40, 74, 0.1), 0 2px 8px rgba(17, 40, 74, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
        "glass-premium":
          "0 12px 48px rgba(17, 40, 74, 0.12), 0 4px 16px rgba(200, 162, 70, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        "glass-selected":
          "0 0 0 2px rgba(200, 162, 70, 0.45), 0 8px 32px rgba(17, 40, 74, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      },
      transitionDuration: {
        fast: "200ms",
        normal: "300ms",
        slow: "500ms",
      },
      transitionTimingFunction: {
        yobell: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backgroundImage: {
        "yobell-navy-gradient":
          "linear-gradient(135deg, var(--yobell-navy) 0%, var(--yobell-navy-light) 100%)",
        "yobell-gold-shine":
          "linear-gradient(135deg, var(--yobell-gold-light) 0%, var(--yobell-gold) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
