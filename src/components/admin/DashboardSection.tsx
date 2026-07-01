"use client";

import { AdminCard, StatCard, Badge, formatDate, STATUS_LABELS } from "./ui";

interface DashboardData {
  stats: {
    todayVisits: number;
    pending: number;
    responded: number;
    staffCount: number;
    companyCount: number;
  };
  latestVisits: Array<{
    id: string;
    visitorName: string;
    visitorCompany: string | null;
    visitorType: string;
    status: string;
    createdAt: string;
    hostStaff: { name: string };
  }>;
  kioskStatus: {
    online: boolean;
    database: string;
    camera: string;
    company: string;
  };
}

export function DashboardSection({ data }: { data: DashboardData | null }) {
  if (!data) {
    return <p className="text-slate-500">読み込み中...</p>;
  }

  const { stats, latestVisits, kioskStatus } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="今日の来訪数" value={stats.todayVisits} accent="navy" />
        <StatCard label="未対応" value={stats.pending} accent="amber" />
        <StatCard label="対応済み" value={stats.responded} accent="green" />
        <StatCard label="登録スタッフ数" value={stats.staffCount} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title="キオスクステータス" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <StatusRow label="オンライン" value={kioskStatus.online ? "Online" : "Offline"} ok={kioskStatus.online} />
            <StatusRow label="データベース" value={kioskStatus.database} ok={kioskStatus.database === "connected"} />
            <StatusRow label="カメラ設定" value={kioskStatus.camera} ok />
            <StatusRow label="表示会社名" value={kioskStatus.company} ok />
          </dl>
        </AdminCard>

        <AdminCard title="最新の来訪（10件）" className="lg:col-span-2">
          {latestVisits.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">来訪記録はまだありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 pr-4 font-medium">日時</th>
                    <th className="pb-3 pr-4 font-medium">来訪者</th>
                    <th className="pb-3 pr-4 font-medium">担当者</th>
                    <th className="pb-3 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {latestVisits.map((v) => {
                    const st = STATUS_LABELS[v.status] ?? { label: v.status, color: "gray" as const };
                    return (
                      <tr key={v.id} className="border-b border-slate-50">
                        <td className="py-3 pr-4 whitespace-nowrap text-slate-500">{formatDate(v.createdAt)}</td>
                        <td className="py-3 pr-4 font-medium">{v.visitorName}</td>
                        <td className="py-3 pr-4 text-slate-600">{v.hostStaff.name}</td>
                        <td className="py-3"><Badge color={st.color}>{st.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="flex items-center gap-2 font-medium text-slate-800">
        <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
        {value}
      </dd>
    </div>
  );
}
