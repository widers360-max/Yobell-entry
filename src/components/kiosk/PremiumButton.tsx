"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { TouchRipple } from "./TouchRipple";

export type PremiumButtonVariant = "primary" | "secondary" | "danger" | "success";
export type PremiumButtonVisualState =
  | "default"
  | "selected"
  | "loading"
  | "success"
  | "danger";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PremiumButtonVariant;
  visualState?: PremiumButtonVisualState;
  size?: "lg" | "md" | "sm";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASS: Record<PremiumButtonVariant, string> = {
  primary: "premium-btn-primary",
  secondary: "premium-btn-secondary",
  danger: "premium-btn-danger",
  success: "premium-btn-success",
};

const SIZE_CLASS = {
  lg: "premium-btn-lg",
  md: "premium-btn-md",
  sm: "premium-btn-sm",
};

export function PremiumButton({
  variant = "primary",
  visualState = "default",
  size = "lg",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...props
}: PremiumButtonProps) {
  const [pressed, setPressed] = useState(false);

  const isLoading = visualState === "loading";
  const isDisabled = disabled || isLoading;
  const resolvedVariant =
    visualState === "success"
      ? "success"
      : visualState === "danger"
        ? "danger"
        : variant;

  return (
    <TouchRipple className={fullWidth ? "block w-full" : "inline-block"} disabled={isDisabled}>
      <button
        type="button"
        {...props}
        disabled={isDisabled}
        onPointerDown={(e) => {
          if (!isDisabled) setPressed(true);
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          setPressed(false);
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          setPressed(false);
          onPointerLeave?.(e);
        }}
        className={[
          "premium-btn",
          SIZE_CLASS[size],
          VARIANT_CLASS[resolvedVariant],
          visualState === "selected" ? "premium-btn-selected" : "",
          pressed && !isDisabled ? "premium-btn-pressed" : "",
          isDisabled ? "premium-btn-disabled" : "",
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
        ) : (
          <>
            {leftIcon && <span className="premium-btn-icon">{leftIcon}</span>}
            <span className="premium-btn-label">{children}</span>
            {rightIcon && <span className="premium-btn-icon">{rightIcon}</span>}
          </>
        )}
      </button>
    </TouchRipple>
  );
}
