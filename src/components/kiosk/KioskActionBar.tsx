"use client";

import { PremiumButton } from "./PremiumButton";

interface KioskActionBarProps {
  backLabel?: string;
  onBack?: () => void;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  primaryVariant?: "primary" | "success" | "danger";
  secondaryLabel?: string;
  onSecondary?: () => void;
  layout?: "row" | "stack";
  className?: string;
}

export function KioskActionBar({
  backLabel,
  onBack,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryDisabled = false,
  primaryVariant = "primary",
  secondaryLabel,
  onSecondary,
  layout = "row",
  className = "",
}: KioskActionBarProps) {
  const hasRow = Boolean((backLabel && onBack) || (primaryLabel && onPrimary));

  return (
    <div className={`flex flex-col gap-g2 ${className}`}>
      {hasRow && (
        <div className={`flex gap-g2 ${!primaryLabel ? "justify-center" : ""}`}>
          {backLabel && onBack && (
            <PremiumButton
              variant="secondary"
              fullWidth
              className={primaryLabel ? "flex-1" : "w-full max-w-xs"}
              onClick={onBack}
            >
              {backLabel}
            </PremiumButton>
          )}
          {primaryLabel && onPrimary && (
            <PremiumButton
              variant={primaryVariant}
              visualState={primaryLoading ? "loading" : "default"}
              fullWidth
              className="flex-1"
              disabled={primaryDisabled}
              onClick={onPrimary}
            >
              {primaryLabel}
            </PremiumButton>
          )}
        </div>
      )}
      {secondaryLabel && onSecondary && (
        <PremiumButton
          variant="secondary"
          fullWidth
          className={layout === "stack" ? "" : "max-w-none"}
          onClick={onSecondary}
        >
          {secondaryLabel}
        </PremiumButton>
      )}
    </div>
  );
}
