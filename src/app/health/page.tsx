"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PremiumSpinner } from "@/components/kiosk";

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
  const [refreshing, setRefreshing] = useState(false);

  const check = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      setData(json);
    } catch {
      setData({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "接続できませんでした。しばらくしてからもう一度お試しください。",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void check();
    const interval = setInterval(() => void check(true), 10000);
    return () => clearInterval(interval);
  }, [check]);

  const healthy = data?.status === "healthy";

  return (
    <div className="flex min-h-screen items-center justify-center bg-yobell-bg p-g4">
      <div className="yobell-card-premium health-panel-enter w-full max-w-lg p-g4">
        <div className="mb-g3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yobell-navy">YOBELL Entry Health</h1>
          <div
            className={`h-4 w-4 rounded-full ${
              loading || refreshing
                ? "health-status-pulse bg-yobell-gold"
                : healthy
                  ? "bg-yobell-success"
                  : "bg-yobell-danger"
            }`}
          />
        </div>

        {loading ? (
          <PremiumSpinner label="チェック中..." />
        ) : data ? (
          <div className="space-y-g2">
            <StatusRow label="ステータス" value={data.status} highlight={healthy} />
            <StatusRow
              label="データベース"
              value={data.database}
              highlight={data.database === "connected"}
            />
            <StatusRow
              label="最終確認"
              value={new Date(data.timestamp).toLocaleString("ja-JP")}
            />

            {data.counts && (
              <div className="rounded-yobell-sm bg-yobell-bg p-g3">
                <p className="mb-g2 text-sm font-semibold text-yobell-muted">データ件数</p>
                <div className="grid grid-cols-3 gap-g2 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yobell-navy">
                      {data.counts.companies}
                    </p>
                    <p className="text-xs text-yobell-muted">会社</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yobell-navy">{data.counts.staff}</p>
                    <p className="text-xs text-yobell-muted">スタッフ</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yobell-navy">{data.counts.visits}</p>
                    <p className="text-xs text-yobell-muted">来訪</p>
                  </div>
                </div>
              </div>
            )}

            {data.settings && (
              <div className="rounded-yobell-sm bg-yobell-bg p-g3 text-sm">
                <p>
                  <span className="text-yobell-muted">ブランド:</span>{" "}
                  {data.settings.brandName}
                </p>
                <p>
                  <span className="text-yobell-muted">言語:</span>{" "}
                  {data.settings.languageDefault}
                </p>
              </div>
            )}

            {data.error && (
              <p className="rounded-yobell-sm border border-yobell-danger/30 bg-yobell-danger/5 p-g2 text-sm text-yobell-danger">
                {data.error}
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-g4 flex gap-g2">
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
    <div className="flex items-center justify-between border-b border-yobell-border pb-g2">
      <span className="text-sm text-yobell-muted">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-yobell-success" : "text-yobell-navy"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
