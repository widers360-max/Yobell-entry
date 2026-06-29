"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HealthData {
  status: string;
  timestamp: string;
  database: string;
  counts?: {
    companies: number;
    staff: number;
    visits: number;
  };
  settings?: {
    brandName: string;
    languageDefault: string;
  };
  error?: string;
}

export default function HealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/health");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData({
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: "disconnected",
          error: e instanceof Error ? e.message : "Unknown",
        });
      } finally {
        setLoading(false);
      }
    }
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const healthy = data?.status === "healthy";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--yobell-primary)]">
            YOBELL Entry Health
          </h1>
          <div
            className={`h-4 w-4 rounded-full ${
              loading
                ? "animate-pulse bg-gray-300"
                : healthy
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          />
        </div>

        {loading ? (
          <p className="text-gray-500">チェック中...</p>
        ) : data ? (
          <div className="space-y-4">
            <StatusRow label="ステータス" value={data.status} highlight={healthy} />
            <StatusRow label="データベース" value={data.database} highlight={data.database === "connected"} />
            <StatusRow label="最終確認" value={new Date(data.timestamp).toLocaleString("ja-JP")} />

            {data.counts && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-500">データ件数</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{data.counts.companies}</p>
                    <p className="text-xs text-gray-500">会社</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data.counts.staff}</p>
                    <p className="text-xs text-gray-500">スタッフ</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data.counts.visits}</p>
                    <p className="text-xs text-gray-500">来訪</p>
                  </div>
                </div>
              </div>
            )}

            {data.settings && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <p>
                  <span className="text-gray-500">ブランド:</span>{" "}
                  {data.settings.brandName}
                </p>
                <p>
                  <span className="text-gray-500">言語:</span>{" "}
                  {data.settings.languageDefault}
                </p>
              </div>
            )}

            {data.error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {data.error}
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-8 flex gap-3">
          <Link href="/" className="admin-btn-primary flex-1 text-center">
            キオスク
          </Link>
          <Link href="/admin" className="admin-btn-secondary flex-1 text-center">
            管理画面
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-green-600" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
