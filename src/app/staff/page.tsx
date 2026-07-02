"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { PasswordGate } from "@/components/PasswordGate";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PremiumSpinner } from "@/components/kiosk";
import { clearUnlock } from "@/lib/auth-session";
import {
  t,
  visitorTypeLabel,
  visitStatusLabel,
  visitStatusBadgeColor,
} from "@/lib/i18n";
import type { Language, VisitorType } from "@/lib/types";

interface Visit {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorPhone: string | null;
  purpose: string | null;
  visitorType: string;
  status: string;
  photoData: string | null;
  createdAt: string;
  hostStaff: {
    id: string;
    name: string;
    department: string;
    company: { name: string };
  };
}

export default function StaffPage() {
  return (
    <PasswordGate role="staff">
      <StaffPageContent />
    </PasswordGate>
  );
}

function StaffPageContent() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ja");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [respondingKey, setRespondingKey] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [newVisitIds, setNewVisitIds] = useState<Set<string>>(new Set());
  const initialLoadDone = useRef(false);
  const knownPendingRef = useRef<Set<string>>(new Set());

  function handleLogout() {
    clearUnlock("staff");
    router.push("/");
  }

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits?summary=true");
      if (!res.ok) throw new Error("fetch failed");
      const data: Visit[] = await res.json();
      const recent = data.filter(
        (v) =>
          v.status === "pending" ||
          (v.status !== "completed" &&
            Date.now() - new Date(v.createdAt).getTime() < 30 * 60 * 1000),
      );

      const pending = recent.filter((v) => v.status === "pending");

      if (!initialLoadDone.current) {
        pending.forEach((v) => knownPendingRef.current.add(v.id));
        initialLoadDone.current = true;
      } else {
        const fresh = pending.filter((v) => !knownPendingRef.current.has(v.id));
        if (fresh.length > 0) {
          setNewVisitIds((prev) => {
            const next = new Set(prev);
            fresh.forEach((v) => next.add(v.id));
            return next;
          });
          fresh.forEach((v) => knownPendingRef.current.add(v.id));
          window.setTimeout(() => {
            setNewVisitIds((prev) => {
              const next = new Set(prev);
              fresh.forEach((v) => next.delete(v.id));
              return next;
            });
          }, 3000);
        }
      }

      setVisits(recent);
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
    const interval = setInterval(fetchVisits, 3000);
    return () => clearInterval(interval);
  }, [fetchVisits]);

  async function respond(visitId: string, status: string) {
    const key = `${visitId}:${status}`;
    setRespondingKey(key);
    setCardErrors((prev) => {
      const next = { ...prev };
      delete next[visitId];
      return next;
    });
    try {
      const res = await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("respond failed");
      await fetchVisits();
    } catch {
      setCardErrors((prev) => ({
        ...prev,
        [visitId]: t(language, "staff_respondFailed"),
      }));
    } finally {
      setRespondingKey(null);
    }
  }

  const pendingVisits = visits.filter((v) => v.status === "pending");

  return (
    <div className="min-h-screen bg-yobell-bg">
      <header className="yobell-glass border-b border-yobell-border px-g3 py-g2 shadow-glass">
        <div className="staff-page-header mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-g2">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-yobell-navy sm:text-2xl">
              {t(language, "staff_title")}
            </h1>
            <p className="text-sm text-yobell-muted">{t(language, "staff_subtitle")}</p>
          </div>
          <div className="staff-page-actions flex flex-wrap items-center gap-g2">
            <LanguageToggle
              language={language}
              onChange={setLanguage}
              variant="premium"
            />
            <Link href="/" className="admin-btn-secondary">
              {t(language, "staff_linkKiosk")}
            </Link>
            <Link href="/admin" className="admin-btn-secondary">
              {t(language, "staff_linkAdmin")}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-btn-secondary flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t(language, "auth_logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-g3 py-g4">
        {loading ? (
          <div className="py-20">
            <PremiumSpinner label={t(language, "kiosk_loading")} size="lg" />
          </div>
        ) : fetchError ? (
          <div className="rounded-yobell border border-yobell-danger/30 bg-yobell-surface p-g4 text-center">
            <p className="text-lg font-semibold text-yobell-navy">
              {t(language, "kiosk_errorTitle")}
            </p>
            <p className="mt-g1 text-yobell-muted">{t(language, "kiosk_errorMessage")}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void fetchVisits();
              }}
              className="admin-btn-primary mt-g3"
            >
              {t(language, "kiosk_retry")}
            </button>
          </div>
        ) : pendingVisits.length === 0 ? (
          <div className="admin-empty rounded-yobell border-2 border-dashed border-yobell-border bg-yobell-surface py-g6">
            <div className="mx-auto mb-g2 flex h-16 w-16 items-center justify-center rounded-full bg-yobell-bg">
              <Bell className="h-8 w-8 text-yobell-muted" strokeWidth={1.5} />
            </div>
            <p className="admin-empty-title text-lg">{t(language, "staff_emptyTitle")}</p>
            <p className="admin-empty-desc">{t(language, "staff_emptyDesc")}</p>
          </div>
        ) : (
          <div className="space-y-g3">
            <div className="flex items-center gap-g2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yobell-danger text-sm font-bold text-white health-status-pulse">
                {pendingVisits.length}
              </span>
              <h2 className="text-xl font-bold text-yobell-navy">
                {t(language, "staff_newVisitors")}
              </h2>
            </div>

            {pendingVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                language={language}
                isNew={newVisitIds.has(visit.id)}
                respondingKey={respondingKey}
                errorMessage={cardErrors[visit.id]}
                onRespond={respond}
              />
            ))}
          </div>
        )}

        {visits.filter((v) => v.status !== "pending").length > 0 && (
          <div className="mt-g4">
            <h2 className="mb-g2 text-lg font-bold text-yobell-muted">
              {t(language, "staff_recentHistory")}
            </h2>
            <div className="space-y-g2">
              {visits
                .filter((v) => v.status !== "pending")
                .slice(0, 10)
                .map((visit) => (
                  <div key={visit.id} className="staff-history-row">
                    <div className="min-w-0">
                      <span className="font-semibold text-yobell-navy">
                        {visit.visitorName}
                      </span>
                      <span className="mx-2 text-yobell-muted">→</span>
                      <span className="text-yobell-muted">{visit.hostStaff.name}</span>
                    </div>
                    <span
                      className={`admin-badge shrink-0 ${visitStatusBadgeColor(visit.status)}`}
                    >
                      {visitStatusLabel(language, visit.status)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function VisitCard({
  visit,
  language,
  isNew,
  respondingKey,
  errorMessage,
  onRespond,
}: {
  visit: Visit;
  language: Language;
  isNew: boolean;
  respondingKey: string | null;
  errorMessage?: string;
  onRespond: (id: string, status: string) => void;
}) {
  const time = new Date(visit.createdAt).toLocaleTimeString(
    language === "ko" ? "ko-KR" : language === "en" ? "en-US" : "ja-JP",
    { hour: "2-digit", minute: "2-digit" },
  );

  const actions = [
    { status: "accepted", labelKey: "staff_respondAccept" as const, className: "text-yobell-success hover:bg-green-50" },
    { status: "please_wait", labelKey: "staff_respondWait" as const, className: "text-yobell-gold hover:bg-amber-50" },
    { status: "declined", labelKey: "staff_respondDecline" as const, className: "text-yobell-danger hover:bg-red-50" },
  ];

  const visitResponding = respondingKey?.startsWith(`${visit.id}:`) ?? false;

  return (
    <div className={`staff-visit-card ${isNew ? "staff-visit-card-new" : ""}`}>
      <div className="flex flex-col gap-g3 p-g3 sm:flex-row sm:items-start">
        <div className="staff-card-avatar mx-auto h-20 w-20 shrink-0 text-3xl sm:mx-0 sm:h-24 sm:w-24">
          <span>{visit.visitorName.charAt(0)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-g2">
            <div>
              <h3 className="text-xl font-bold text-yobell-navy sm:text-2xl">
                {visit.visitorName}
              </h3>
              {visit.visitorCompany && (
                <p className="text-base text-yobell-muted sm:text-lg">{visit.visitorCompany}</p>
              )}
            </div>
            <span className="text-sm tabular-nums text-yobell-muted">{time}</span>
          </div>

          <div className="mt-g2 flex flex-wrap gap-g1">
            <span className="admin-badge admin-badge-navy">
              {visitorTypeLabel(language, visit.visitorType as VisitorType)}
            </span>
            {visit.purpose && (
              <span className="admin-badge admin-badge-gray">{visit.purpose}</span>
            )}
            {visit.visitorPhone && (
              <span className="admin-badge admin-badge-gray">{visit.visitorPhone}</span>
            )}
          </div>

          <p className="mt-g2 text-base text-yobell-navy sm:text-lg">
            {t(language, "staff_hostLabel")}: <strong>{visit.hostStaff.name}</strong>
            <span className="text-yobell-muted">
              {" "}
              ({visit.hostStaff.company.name} / {visit.hostStaff.department})
            </span>
          </p>

          {errorMessage && (
            <p className="mt-g2 text-sm font-medium text-yobell-danger" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="staff-response-grid grid grid-cols-1 border-t border-yobell-border sm:grid-cols-3">
        {actions.map(({ status, labelKey, className }, index) => {
          const key = `${visit.id}:${status}`;
          const isLoading = respondingKey === key;

          return (
            <button
              key={status}
              type="button"
              disabled={visitResponding}
              onClick={() => onRespond(visit.id, status)}
              className={`staff-response-btn border-yobell-border ${className} ${
                index < 2 ? "sm:border-r" : ""
              } ${isLoading ? "staff-response-btn-loading" : ""}`}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t(language, "staff_respondSending")}
                </span>
              ) : (
                t(language, labelKey)
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
