"use client";

import type { ReactNode } from "react";
import type { Language } from "@/lib/types";

export function AdminCard({
  children,
  className = "",
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`yobell-card overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-yobell-border px-g3 py-g2">
          {title && (
            <h3 className="text-base font-bold text-yobell-text">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-g3">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  accent = "navy",
}: {
  label: string;
  value: number | string;
  accent?: "navy" | "amber" | "green" | "blue";
}) {
  const colors = {
    navy: "border-l-yobell-navy text-yobell-navy",
    amber: "border-l-yobell-gold text-yobell-gold",
    green: "border-l-yobell-success text-yobell-success",
    blue: "border-l-yobell-navy-light text-yobell-navy-light",
  };
  return (
    <div
      className={`yobell-card border-l-4 p-g3 ${colors[accent]}`}
    >
      <p className="text-sm font-medium text-yobell-muted">{label}</p>
      <p className="mt-g1 text-3xl font-bold">{value}</p>
    </div>
  );
}

export function AdminInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-g1 block text-sm font-medium text-yobell-muted">
          {label}
        </label>
      )}
      <input {...props} className={`admin-input ${props.className ?? ""}`} />
    </div>
  );
}

export function AdminTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-g1 block text-sm font-medium text-yobell-muted">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`admin-input min-h-[80px] resize-y ${props.className ?? ""}`}
      />
    </div>
  );
}

export function AdminSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-g1 block text-sm font-medium text-yobell-muted">
          {label}
        </label>
      )}
      <select {...props} className={`admin-input ${props.className ?? ""}`}>
        {children}
      </select>
    </div>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary: "yobell-btn-primary shadow-glass",
    secondary: "yobell-btn-secondary",
    danger: "yobell-btn-danger",
    ghost: "text-yobell-muted hover:bg-yobell-bg",
  };
  const sizes = {
    sm: "yobell-btn-sm px-g2",
    md: "yobell-btn-md px-g3",
    lg: "yobell-btn-lg px-g4",
  };
  return (
    <button
      {...props}
      className={`yobell-btn inline-flex items-center justify-center gap-g1 rounded-yobell-sm font-semibold transition-all duration-fast disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: "gray" | "green" | "amber" | "red" | "blue";
}) {
  const colors = {
    gray: "bg-yobell-bg text-yobell-muted",
    green: "bg-yobell-success/10 text-yobell-success",
    amber: "bg-yobell-gold/15 text-yobell-gold-hover",
    red: "bg-yobell-danger/10 text-yobell-danger",
    blue: "bg-yobell-navy/10 text-yobell-navy",
  };
  return (
    <span
      className={`inline-flex rounded-full px-g2 py-0.5 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  if (!message) return null;
  return (
    <div
      className={`fixed right-g3 top-g3 z-50 rounded-yobell-sm px-g3 py-g2 text-sm font-semibold text-white shadow-glass-lg ${
        type === "success" ? "bg-yobell-success" : "bg-yobell-danger"
      }`}
    >
      {message}
    </div>
  );
}

export function formatDate(iso: string, lang: Language = "ja") {
  const locale = lang === "ko" ? "ko-KR" : lang === "en" ? "en-US" : "ja-JP";
  return new Date(iso).toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
