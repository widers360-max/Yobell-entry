"use client";

import { PremiumButton } from "./PremiumButton";

export function KioskErrorState({
  title,
  message,
  retryLabel,
  onRetry,
}: {
  title: string;
  message: string;
  retryLabel: string;
  onRetry?: () => void;
}) {
  return (
    <div className="kiosk-error-state">
      <div className="kiosk-error-icon" aria-hidden>
        !
      </div>
      <h2 className="kiosk-error-title">{title}</h2>
      <p className="kiosk-error-message">{message}</p>
      {onRetry && (
        <PremiumButton variant="primary" onClick={onRetry}>
          {retryLabel}
        </PremiumButton>
      )}
    </div>
  );
}
