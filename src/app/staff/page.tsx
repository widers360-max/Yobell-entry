"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { PasswordGate } from "@/components/PasswordGate";
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
  pending: { label: "未対応", color: "bg-amber-100 text-amber-800" },
  accepted: { label: "対応中", color: "bg-green-100 text-green-800" },
  please_wait: { label: "お待ちください", color: "bg-blue-100 text-blue-800" },
  declined: { label: "対応不可", color: "bg-red-100 text-red-800" },
  no_response: { label: "無応答", color: "bg-gray-100 text-gray-800" },
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

  function handleLogout() {
    clearUnlock("staff");
    router.push("/");
  }

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits");
      const data = await res.json();
      const recent = data.filter(
        (v: Visit) =>
          v.status === "pending" ||
          (v.status !== "completed" &&
            Date.now() - new Date(v.createdAt).getTime() < 30 * 60 * 1000)
      );
      setVisits(recent);
    } catch {
      /* ignore */
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
    await fetch(`/api/visits/${visitId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchVisits();
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

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-500">読み込み中...</p>
        ) : pendingVisits.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xl text-gray-500">現在、待機中の来訪者はいません</p>
            <p className="mt-2 text-sm text-gray-400">3秒ごとに自動更新されます</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white animate-pulse">
                {pendingVisits.length}
              </span>
              <h2 className="text-xl font-bold">新しい来訪者</h2>
            </div>

            {pendingVisits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} onRespond={respond} />
            ))}
          </div>
        )}

        {visits.filter((v) => v.status !== "pending").length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-bold text-gray-600">最近の対応</h2>
            <div className="space-y-3">
              {visits
                .filter((v) => v.status !== "pending")
                .slice(0, 10)
                .map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between rounded-xl border bg-white px-5 py-4"
                  >
                    <div>
                      <span className="font-semibold">{visit.visitorName}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-gray-600">{visit.hostStaff.name}</span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_LABELS[visit.status]?.color ?? "bg-gray-100"
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
  onRespond,
}: {
  visit: Visit;
  onRespond: (id: string, status: string) => void;
}) {
  const time = new Date(visit.createdAt).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-lg">
      <div className="flex items-start gap-6 p-6">
        {visit.photoData ? (
          <img
            src={visit.photoData}
            alt={visit.visitorName}
            className="h-24 w-24 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl font-bold text-gray-400">
            {visit.visitorName.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{visit.visitorName}</h3>
              {visit.visitorCompany && (
                <p className="text-lg text-gray-600">{visit.visitorCompany}</p>
              )}
            </div>
            <span className="text-sm text-gray-400">{time}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              {VISITOR_TYPE_LABELS[visit.visitorType] ?? visit.visitorType}
            </span>
            {visit.purpose && (
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {visit.purpose}
              </span>
            )}
            {visit.visitorPhone && (
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {visit.visitorPhone}
              </span>
            )}
          </div>

          <p className="mt-3 text-lg">
            担当: <strong>{visit.hostStaff.name}</strong>
            <span className="text-gray-500">
              {" "}
              ({visit.hostStaff.company.name} / {visit.hostStaff.department})
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 border-t">
        <button
          type="button"
          onClick={() => onRespond(visit.id, "accepted")}
          className="border-r py-5 text-lg font-bold text-green-700 transition-colors hover:bg-green-50 active:bg-green-100"
        >
          今行きます
        </button>
        <button
          type="button"
          onClick={() => onRespond(visit.id, "please_wait")}
          className="border-r py-5 text-lg font-bold text-amber-700 transition-colors hover:bg-amber-50 active:bg-amber-100"
        >
          少々お待ちください
        </button>
        <button
          type="button"
          onClick={() => onRespond(visit.id, "declined")}
          className="py-5 text-lg font-bold text-red-700 transition-colors hover:bg-red-50 active:bg-red-100"
        >
          本日は対応できません
        </button>
      </div>
    </div>
  );
}
