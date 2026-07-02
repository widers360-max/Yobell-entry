"use client";

import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { TouchRipple } from "./TouchRipple";

type PremiumCardLayout = "vertical" | "horizontal";

interface PremiumCardProps {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  icon?: LucideIcon;
  iconNode?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  layout?: PremiumCardLayout;
  primaryColor?: string;
  className?: string;
  minHeight?: string;
}

export function PremiumCard({
  title,
  subtitle,
  meta,
  badge,
  icon: Icon,
  iconNode,
  selected = false,
  onClick,
  layout = "vertical",
  primaryColor = "var(--yobell-navy)",
  className = "",
  minHeight,
}: PremiumCardProps) {
  const [pressed, setPressed] = useState(false);
  const isInteractive = Boolean(onClick);

  const iconContent =
    iconNode ??
    (Icon ? (
      <Icon className="h-6 w-6" style={{ color: primaryColor }} strokeWidth={1.75} />
    ) : null);

  const body =
    layout === "horizontal" ? (
      <>
        {iconContent && (
          <div
            className="premium-card-icon premium-card-icon-lg shrink-0 text-white"
            style={{ background: primaryColor }}
          >
            {iconNode ?? (Icon && <Icon className="h-10 w-10" strokeWidth={1.75} />)}
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-start gap-g2">
            <p className="text-2xl font-bold leading-tight text-yobell-navy md:text-3xl">
              {title}
            </p>
            {badge && <span className="premium-card-badge">{badge}</span>}
          </div>
          {subtitle && (
            <p className="mt-g1 text-lg leading-relaxed text-yobell-muted md:text-xl">
              {subtitle}
            </p>
          )}
          {meta && (
            <p className="mt-1 text-base font-medium text-yobell-gold">{meta}</p>
          )}
        </div>
      </>
    ) : (
      <>
        {badge && <span className="premium-card-badge absolute right-g2 top-g2">{badge}</span>}
        {iconContent && (
          <div
            className="premium-card-icon shrink-0"
            style={{ background: `${primaryColor}12` }}
          >
            {iconContent}
          </div>
        )}
        <span className="text-base font-bold leading-tight text-yobell-navy md:text-lg">
          {title}
        </span>
        {subtitle && (
          <span className="line-clamp-2 text-[11px] leading-snug text-yobell-muted md:text-sm">
            {subtitle}
          </span>
        )}
      </>
    );

  const cardClass = [
    "premium-card",
    layout === "horizontal" ? "premium-card-horizontal" : "premium-card-vertical",
    isInteractive ? "premium-card-interactive" : "",
    selected || pressed ? "premium-card-selected" : "",
    pressed ? "premium-card-pressed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!isInteractive) {
    return (
      <div className={cardClass} style={minHeight ? { minHeight } : undefined}>
        {body}
      </div>
    );
  }

  return (
    <TouchRipple className="block w-full">
      <button
        type="button"
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={cardClass}
        style={minHeight ? { minHeight } : undefined}
      >
        {body}
      </button>
    </TouchRipple>
  );
}
