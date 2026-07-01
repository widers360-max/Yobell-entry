"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge, formatDate, STATUS_LABELS } from "./ui";

interface Visit {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  status: string;
  photoData: string | null;
  createdAt: string;
  hostStaff: { name: string; company: { name: string } };
}

const TYPE_LABELS: Record<string, string> = {
  meeting: "打ち合わせ",
  delivery: "配達・宅配",
  interview: "面接・面談",
  maintenance: "工事・点検",
  reception: "ご案内・受付",
  tour: "会社見学",
  other: "その他",
};

export function VisitsSection({
  retentionDays,
  onMessage,
}: {
  retentionDays: number;
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    host: "",
    status: "",
    visitorType: "",
    from: "",
    to: "",
  });

  const loadVisits = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.host) params.set("host", filters.host);
    if (filters.status) params.set("status", filters.status);
    if (filters.visitorType) params.set("visitorType", filters.visitorType);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    const res = await fetch(`/api/visits?${params}`);
    setVisits(await res.json());
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadVisits();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function purgeOld() {
    if (!confirm(`${retentionDays}日より古いログを削除しますか？`)) return;
    const res = await fetch("/api/visits/purge", { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      onMessage("削除に失敗しました", "error");
      return;
    }
    onMessage(`${data.deleted}件のログを削除しました`);
    loadVisits();
  }

  return (
    <div className="space-y-6">
      <AdminCard title="検索・フィルター">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminInput label="来訪者名・会社" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="検索..." />
          <AdminInput label="担当者・会社" value={filters.host} onChange={(e) => setFilters({ ...filters, host: e.target.value })} placeholder="担当者名..." />
          <AdminSelect label="ステータス" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">すべて</option>
            <option value="pending">未対応</option>
            <option value="accepted">対応中</option>
            <option value="please_wait">お待ちください</option>
            <option value="declined">対応不可</option>
            <option value="no_response">無応答</option>
          </AdminSelect>
          <AdminSelect label="来訪種別" value={filters.visitorType} onChange={(e) => setFilters({ ...filters, visitorType: e.target.value })}>
            <option value="">すべて</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </AdminSelect>
          <AdminInput label="開始日" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <AdminInput label="終了日" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={loadVisits} disabled={loading}>
            <Search className="h-4 w-4" />{loading ? "検索中..." : "検索"}
          </Btn>
          <a href="/api/visits/export" className="inline-flex">
            <Btn variant="secondary"><Download className="h-4 w-4" />CSVエクスポート</Btn>
          </a>
          <Btn variant="danger" onClick={purgeOld}>
            <Trash2 className="h-4 w-4" />保持期間外ログを削除
          </Btn>
        </div>
      </AdminCard>

      <AdminCard title={`来訪ログ（${visits.length}件）`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-3 font-medium">日時</th>
                <th className="pb-3 pr-3 font-medium">写真</th>
                <th className="pb-3 pr-3 font-medium">来訪者</th>
                <th className="pb-3 pr-3 font-medium">会社</th>
                <th className="pb-3 pr-3 font-medium">種別</th>
                <th className="pb-3 pr-3 font-medium">担当者</th>
                <th className="pb-3 font-medium">状態</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const st = STATUS_LABELS[v.status] ?? { label: v.status, color: "gray" as const };
                return (
                  <tr key={v.id} className="border-b border-slate-50">
                    <td className="py-3 pr-3 whitespace-nowrap text-slate-500">{formatDate(v.createdAt)}</td>
                    <td className="py-3 pr-3">
                      {v.photoData ? (
                        <img src={v.photoData} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">—</div>
                      )}
                    </td>
                    <td className="py-3 pr-3 font-medium">{v.visitorName}</td>
                    <td className="py-3 pr-3">{v.visitorCompany ?? "—"}</td>
                    <td className="py-3 pr-3">{TYPE_LABELS[v.visitorType] ?? v.visitorType}</td>
                    <td className="py-3 pr-3">{v.hostStaff.name}</td>
                    <td className="py-3"><Badge color={st.color}>{st.label}</Badge></td>
                  </tr>
                );
              })}
              {visits.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">来訪ログはありません。検索ボタンを押してください。</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
