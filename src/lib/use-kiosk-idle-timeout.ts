"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "touchstart",
  "keydown",
  "mousemove",
  "click",
] as const;

/**
 * Resets a timer on user activity; calls onTimeout after idleSeconds with no interaction.
 */
export function useKioskIdleTimeout({
  idleSeconds,
  onTimeout,
  enabled = true,
}: {
  idleSeconds: number;
  onTimeout: () => void;
  enabled?: boolean;
}) {
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (!enabled || idleSeconds <= 0) return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onTimeoutRef.current(), idleSeconds * 1000);
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, reset, { passive: true, capture: true });
    }
    reset();

    return () => {
      clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, reset, { capture: true });
      }
    };
  }, [idleSeconds, enabled]);
}
