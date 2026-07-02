"use client";

import {
  useRef,
  useState,
  useCallback,
  type PointerEvent,
  type ReactNode,
} from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface TouchRippleProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TouchRipple({ children, className = "", disabled }: TouchRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++idRef.current;

      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 450);
    },
    [disabled],
  );

  return (
    <div
      ref={containerRef}
      className={`touch-ripple-container relative overflow-hidden ${className}`}
      onPointerDown={handlePointerDown}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="touch-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          aria-hidden
        />
      ))}
      {children}
    </div>
  );
}
