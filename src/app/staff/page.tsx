"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  VISIT_STATUS,
  visitorTypeLabel,
  type VisitStatusKey,
} from "@/lib/constants";

type Visit = {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  purpose: string | null;
  partySize: number;
  status: VisitStatusKey;
  photoData: string | null;
  responseNote: string | null;
  createdAt: string;
  staff: { name: string; company: { name: string } } | null;
};

export default function StaffPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/visits?take=100", { cache: "no-store" });
      const data = await res.json();
      setVisits(data.visits ?? []);
    } catch {
      // keep previous data on transient errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  async function updateStatus(
    visitId: string,
    status: VisitStatusKey,
    responseNote?: string,
  ) {
    setBusyId(visitId);
    try {
      await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, responseNote }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const active = visits.filter((v) =>
    ["WAITING", "ACKNOWLEDGED", "ON_THE_WAY"].includes(v.status),
  );
  const recent = visits.filter((v) =>
    ["COMPLETED", "CANCELLED"].includes(v.status),
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 pb-24 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">スタッフ受付ダッシュボード</h1>
          <p className="text-sm text-slate-500">
            来訪者の呼び出しに応答してください（5秒ごとに自動更新）
          </p>
        </div>
        <Link href="/" className="text-sm text-slate-500 hover:text-brand">
          トップへ
        </Link>
      </header>

      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
        <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-amber-500" />
        対応中の呼び出し（{active.length}）
      </h2>

      {loading ? (
        <p className="py-10 text-center text-slate-400">読み込み中...</p>
      ) : active.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-slate-400">
          現在、対応待ちの来訪者はいません 🎉
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {active.map((v) => (
            <article
              key={v.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {v.photoData ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.photoData}
                      alt={v.visitorName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                      👤
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-bold">{v.visitorName}</div>
                    <div className="text-sm text-slate-500">
                      {v.visitorCompany || "（会社名なし）"}
                    </div>
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>

              <dl className="mt-3 space-y-1 text-sm text-slate-600">
                <div>区分: {visitorTypeLabel(v.visitorType)}</div>
                <div>
                  訪問先: {v.staff?.company?.name ?? "不明"} /{" "}
                  {v.staff?.name ?? "担当者未指定"}
                </div>
                {v.purpose && <div>用件: {v.purpose}</div>}
                <div>人数: {v.partySize}名</div>
                <div className="text-xs text-slate-400">
                  受付: {new Date(v.createdAt).toLocaleTimeString("ja-JP")}
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  disabled={busyId === v.id}
                  onClick={() =>
                    updateStatus(v.id, "ON_THE_WAY", "すぐ行きます")
                  }
                  className="rounded-xl bg-indigo-600 px-3 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  すぐ行きます
                </button>
                <button
                  disabled={busyId === v.id}
                  onClick={() =>
                    updateStatus(v.id, "ACKNOWLEDGED", "少々お待ちください")
                  }
                  className="rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  少々お待ちを
                </button>
                <button
                  disabled={busyId === v.id}
                  onClick={() => updateStatus(v.id, "COMPLETED")}
                  className="rounded-xl bg-green-600 px-3 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  対応完了
                </button>
                <button
                  disabled={busyId === v.id}
                  onClick={() => updateStatus(v.id, "CANCELLED")}
                  className="rounded-xl bg-slate-200 px-3 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
                >
                  キャンセル
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <>
          <h2 className="mb-3 mt-10 text-xl font-bold text-slate-600">
            最近の対応履歴
          </h2>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {recent.slice(0, 10).map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-bold">{v.visitorName}</span>{" "}
                  <span className="text-slate-400">
                    {v.visitorCompany || ""}
                  </span>
                </span>
                <StatusBadge status={v.status} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: VisitStatusKey }) {
  const s = VISIT_STATUS[status] ?? VISIT_STATUS.WAITING;
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${s.color}`}
    >
      {s.label}
    </span>
  );
}
