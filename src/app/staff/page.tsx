"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { PasswordGate } from "@/components/PasswordGate";
import { PremiumSpinner } from "@/components/kiosk";
import { clearUnlock } from "@/lib/auth-session";
import { t } from "@/lib/i18n";

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

const VISITOR_TYPE_LABELS: Record<string, string> = {
  meeting: "打ち合わせ",
  delivery: "配達・宅配",
  interview: "面接・面談",
  maintenance: "工事・点検",
  reception: "ご案内・受付",
  tour: "会社見学",
  other: "その他",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "未対応", color: "admin-badge-amber" },
  accepted: { label: "対応中", color: "admin-badge-green" },
  please_wait: { label: "お待ちください", color: "admin-badge-blue" },
  declined: { label: "対応不可", color: "admin-badge-red" },
  no_response: { label: "無応答", color: "admin-badge-gray" },
};

export default function StaffPage() {
  return (
    <PasswordGate role="staff">
      <StaffPageContent />
    </PasswordGate>
  );
}

function StaffPageContent() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [respondingKey, setRespondingKey] = useState<string | null>(null);
  const [newVisitIds, setNewVisitIds] = useState<Set<string>>(new Set());
  const initialLoadDone = useRef(false);
  const knownPendingRef = useRef<Set<string>>(new Set());

  function handleLogout() {
    clearUnlock("staff");
    router.push("/");
  }

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits");
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
    try {
      const res = await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("respond failed");
      await fetchVisits();
    } catch {
      setFetchError(true);
    } finally {
      setRespondingKey(null);
    }
  }

  const pendingVisits = visits.filter((v) => v.status === "pending");

  return (
    <div className="min-h-screen bg-yobell-bg">
      <header className="yobell-glass border-b border-yobell-border px-g3 py-g2 shadow-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yobell-navy">
              YOBELL Entry — スタッフ通知
            </h1>
            <p className="text-sm text-yobell-muted">
              来訪者の呼び出しをリアルタイムで確認・対応
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="admin-btn-secondary">
              キオスク
            </Link>
            <Link href="/admin" className="admin-btn-secondary">
              管理画面
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-btn-secondary flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t("ja", "auth_logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-g3 py-g4">
        {loading ? (
          <div className="py-20">
            <PremiumSpinner label="読み込み中..." size="lg" />
          </div>
        ) : fetchError ? (
          <div className="rounded-yobell border border-yobell-danger/30 bg-yobell-surface p-g4 text-center">
            <p className="text-lg font-semibold text-yobell-navy">通信エラー</p>
            <p className="mt-g1 text-yobell-muted">
              しばらくしてからもう一度お試しください
            </p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void fetchVisits();
              }}
              className="admin-btn-primary mt-g3"
            >
              再試行
            </button>
          </div>
        ) : pendingVisits.length === 0 ? (
          <div className="admin-empty rounded-yobell border-2 border-dashed border-yobell-border bg-yobell-surface py-g6">
            <div className="mx-auto mb-g2 flex h-16 w-16 items-center justify-center rounded-full bg-yobell-bg">
              <Bell className="h-8 w-8 text-yobell-muted" strokeWidth={1.5} />
            </div>
            <p className="admin-empty-title text-lg">現在、待機中の来訪者はいません</p>
            <p className="admin-empty-desc">3秒ごとに自動更新されます</p>
          </div>
        ) : (
          <div className="space-y-g3">
            <div className="flex items-center gap-g2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yobell-danger text-sm font-bold text-white health-status-pulse">
                {pendingVisits.length}
              </span>
              <h2 className="text-xl font-bold text-yobell-navy">新しい来訪者</h2>
            </div>

            {pendingVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                isNew={newVisitIds.has(visit.id)}
                respondingKey={respondingKey}
                onRespond={respond}
              />
            ))}
          </div>
        )}

        {visits.filter((v) => v.status !== "pending").length > 0 && (
          <div className="mt-g4">
            <h2 className="mb-g2 text-lg font-bold text-yobell-muted">最近の対応</h2>
            <div className="space-y-g2">
              {visits
                .filter((v) => v.status !== "pending")
                .slice(0, 10)
                .map((visit) => (
                  <div key={visit.id} className="staff-history-row">
                    <div>
                      <span className="font-semibold text-yobell-navy">
                        {visit.visitorName}
                      </span>
                      <span className="mx-2 text-yobell-muted">→</span>
                      <span className="text-yobell-muted">{visit.hostStaff.name}</span>
                    </div>
                    <span
                      className={`admin-badge ${
                        STATUS_LABELS[visit.status]?.color ?? "admin-badge-gray"
                      }`}
                    >
                      {STATUS_LABELS[visit.status]?.label ?? visit.status}
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
  isNew,
  respondingKey,
  onRespond,
}: {
  visit: Visit;
  isNew: boolean;
  respondingKey: string | null;
  onRespond: (id: string, status: string) => void;
}) {
  const time = new Date(visit.createdAt).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const actions = [
    { status: "accepted", label: "今行きます", className: "text-yobell-success border-r border-yobell-border hover:bg-green-50" },
    { status: "please_wait", label: "少々お待ちください", className: "text-yobell-gold border-r border-yobell-border hover:bg-amber-50" },
    { status: "declined", label: "本日は対応できません", className: "text-yobell-danger hover:bg-red-50" },
  ] as const;

  return (
    <div className={`staff-visit-card ${isNew ? "staff-visit-card-new" : ""}`}>
      <div className="flex items-start gap-g3 p-g3">
        {visit.photoData ? (
          <img
            src={visit.photoData}
            alt={visit.visitorName}
            className="h-24 w-24 shrink-0 rounded-yobell-sm object-cover"
          />
        ) : (
          <div className="staff-card-avatar h-24 w-24 shrink-0 text-3xl">
            <span>{visit.visitorName.charAt(0)}</span>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-g2">
            <div>
              <h3 className="text-2xl font-bold text-yobell-navy">{visit.visitorName}</h3>
              {visit.visitorCompany && (
                <p className="text-lg text-yobell-muted">{visit.visitorCompany}</p>
              )}
            </div>
            <span className="text-sm tabular-nums text-yobell-muted">{time}</span>
          </div>

          <div className="mt-g2 flex flex-wrap gap-g1">
            <span className="admin-badge admin-badge-navy">
              {VISITOR_TYPE_LABELS[visit.visitorType] ?? visit.visitorType}
            </span>
            {visit.purpose && (
              <span className="admin-badge admin-badge-gray">{visit.purpose}</span>
            )}
            {visit.visitorPhone && (
              <span className="admin-badge admin-badge-gray">{visit.visitorPhone}</span>
            )}
          </div>

          <p className="mt-g2 text-lg text-yobell-navy">
            担当: <strong>{visit.hostStaff.name}</strong>
            <span className="text-yobell-muted">
              {" "}
              ({visit.hostStaff.company.name} / {visit.hostStaff.department})
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 border-t border-yobell-border">
        {actions.map(({ status, label, className }) => {
          const key = `${visit.id}:${status}`;
          const isLoading = respondingKey === key;
          const isDisabled = respondingKey !== null;

          return (
            <button
              key={status}
              type="button"
              disabled={isDisabled}
              onClick={() => onRespond(visit.id, status)}
              className={`staff-response-btn ${className} ${
                isLoading ? "staff-response-btn-loading" : ""
              }`}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  送信中
                </span>
              ) : (
                label
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
