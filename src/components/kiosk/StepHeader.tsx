"use client";

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function StepHeader({ title, subtitle, className = "" }: StepHeaderProps) {
  return (
    <header className={`kiosk-step-header text-center ${className}`}>
      <h2 className="kiosk-heading text-3xl md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-g2 text-lg leading-relaxed text-yobell-muted md:text-xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
