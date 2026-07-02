"use client";

import type { ReactNode } from "react";
import type { Language } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function AdminCard({
  children,
  className = "",
  title,
  description,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`admin-card ${className}`}>
      {(title || action) && (
        <div className="admin-card-header">
          <div>
            {title && <h3 className="admin-card-title">{title}</h3>}
            {description && <p className="admin-card-description">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="admin-card-body">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  accent = "navy",
  hint,
}: {
  label: string;
  value: number | string;
  accent?: "navy" | "amber" | "green" | "blue" | "gold";
  hint?: string;
}) {
  return (
    <div className={`admin-stat-card admin-stat-${accent}`}>
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value">{value}</p>
      {hint && <p className="admin-stat-hint">{hint}</p>}
    </div>
  );
}

export function AdminInput({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      <input {...props} className={`admin-input ${props.className ?? ""}`} />
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

export function AdminTextarea({
  label,
  hint,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      <textarea
        {...props}
        className={`admin-input min-h-[88px] resize-y ${props.className ?? ""}`}
      />
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

export function AdminSelect({
  label,
  hint,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      <select {...props} className={`admin-input ${props.className ?? ""}`}>
        {children}
      </select>
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

export function Btn({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`admin-btn admin-btn-${variant} admin-btn-${size} ${
        loading ? "admin-btn-loading" : ""
      } ${props.className ?? ""}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: "gray" | "green" | "amber" | "red" | "blue" | "navy";
}) {
  return <span className={`admin-badge admin-badge-${color}`}>{children}</span>;
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
    <div className={`admin-toast admin-toast-${type}`} role="status">
      {message}
    </div>
  );
}

export function AdminLoading({ label }: { label: string }) {
  return (
    <div className="admin-loading">
      <Loader2 className="h-6 w-6 animate-spin text-yobell-gold" />
      <p>{label}</p>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="admin-empty">
      <p className="admin-empty-title">{title}</p>
      {description && <p className="admin-empty-desc">{description}</p>}
    </div>
  );
}

export function AdminTable({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`admin-table-wrap ${className}`}>
      <table className="admin-table">{children}</table>
    </div>
  );
}

export function AdminFormActions({ children }: { children: ReactNode }) {
  return <div className="admin-form-actions">{children}</div>;
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

export function formatDuration(seconds: number | null, preparingLabel: string): string {
  if (seconds === null || seconds <= 0) return preparingLabel;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest > 0 ? `${minutes}m ${rest}s` : `${minutes}m`;
}
