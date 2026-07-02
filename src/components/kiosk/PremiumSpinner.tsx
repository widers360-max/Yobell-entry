"use client";

import { Loader2 } from "lucide-react";

export function PremiumSpinner({
  label,
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconClass =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <div className="premium-spinner" role="status" aria-live="polite">
      <Loader2 className={`${iconClass} animate-spin text-yobell-gold`} />
      {label && <p className="premium-spinner-label">{label}</p>}
    </div>
  );
}
