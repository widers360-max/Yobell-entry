"use client";

import { type ReactNode } from "react";

interface KioskStepTransitionProps {
  stepKey: string;
  children: ReactNode;
  className?: string;
}

export function KioskStepTransition({
  stepKey,
  children,
  className = "",
}: KioskStepTransitionProps) {
  return (
    <div key={stepKey} className={`kiosk-step-enter ${className}`}>
      {children}
    </div>
  );
}
