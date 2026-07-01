"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, Database } from "lucide-react";
import { AdminCard, Btn } from "./ui";
import { APP_VERSION } from "@/lib/types";

export function SystemSection({
  dbStatus,
  onMessage,
  onRefresh,
}: {
  dbStatus: string;
  onMessage: (msg: string, type?: "success" | "error") => void;
  onRefresh: () => void;
}) {
  const [resetting, setResetting] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  async function resetSeed() {
    if (!confirm("シードデータを再投入します。既存データは上書きされます。よろしいですか？")) return;
    setResetting(true);
    const res = await fetch("/api/admin/reset-seed", { method: "POST" });
    const data = await res.json();
    setResetting(false);
    if (!res.ok) {
      onMessage(data.error ?? "リセットに失敗しました", "error");
      return;
    }
    onMessage(data.message ?? "シードデータを再投入しました");
    onRefresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard title="アプリケーション情報">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">バージョン</dt>
            <dd className="font-bold text-slate-800">YOBELL Entry v{APP_VERSION}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">環境</dt>
            <dd className="font-medium">{process.env.NODE_ENV ?? "development"}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500">データベース</dt>
            <dd className="flex items-center gap-2 font-medium">
              <Database className="h-4 w-4" />
              {dbStatus}
            </dd>
          </div>
        </dl>
      </AdminCard>

      <AdminCard title="クイックリンク">
        <div className="grid gap-3">
          <Link href="/" target="_blank">
            <Btn variant="secondary" className="w-full justify-start">
              <ExternalLink className="h-4 w-4" />キオスクを開く（/）
            </Btn>
          </Link>
          <Link href="/staff" target="_blank">
            <Btn variant="secondary" className="w-full justify-start">
              <ExternalLink className="h-4 w-4" />スタッフ通知を開く（/staff）
            </Btn>
          </Link>
          <Link href="/health" target="_blank">
            <Btn variant="secondary" className="w-full justify-start">
              <ExternalLink className="h-4 w-4" />ヘルスチェックを開く（/health）
            </Btn>
          </Link>
        </div>
      </AdminCard>

      {isDev && (
        <AdminCard title="開発者ツール" className="lg:col-span-2">
          <p className="mb-4 text-sm text-slate-500">
            開発環境のみ利用可能です。シードデータを再投入すると、会社・スタッフ・設定が初期状態に戻ります。
          </p>
          <Btn variant="danger" onClick={resetSeed} disabled={resetting}>
            <RefreshCw className={`h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
            {resetting ? "リセット中..." : "シードデータを再投入"}
          </Btn>
        </AdminCard>
      )}
    </div>
  );
}
