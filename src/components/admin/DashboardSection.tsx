"use client";

import { AdminCard, StatCard, Badge, formatDate } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";
import { getStatusLabel } from "@/lib/admin-i18n";

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
  const { lang, t } = useAdminI18n();

  if (!data) {
    return <p className="text-slate-500">{t("loading")}</p>;
  }

  const { stats, latestVisits, kioskStatus } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t("dash_todayVisits")} value={stats.todayVisits} accent="navy" />
        <StatCard label={t("dash_pending")} value={stats.pending} accent="amber" />
        <StatCard label={t("dash_responded")} value={stats.responded} accent="green" />
        <StatCard label={t("dash_staffCount")} value={stats.staffCount} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title={t("dash_kioskStatus")} className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <StatusRow
              label={t("dash_online")}
              value={kioskStatus.online ? t("dash_online") : t("dash_offline")}
              ok={kioskStatus.online}
            />
            <StatusRow
              label={t("dash_database")}
              value={kioskStatus.database}
              ok={kioskStatus.database === "connected"}
            />
            <StatusRow label={t("dash_camera")} value={kioskStatus.camera} ok />
            <StatusRow label={t("dash_company")} value={kioskStatus.company} ok />
          </dl>
        </AdminCard>

        <AdminCard title={t("dash_latestVisits")} className="lg:col-span-2">
          {latestVisits.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">{t("dash_noVisits")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 pr-4 font-medium">{t("col_datetime")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("col_visitor")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("col_host")}</th>
                    <th className="pb-3 font-medium">{t("col_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {latestVisits.map((v) => {
                    const st = getStatusLabel(lang, v.status);
                    return (
                      <tr key={v.id} className="border-b border-slate-50">
                        <td className="py-3 pr-4 whitespace-nowrap text-slate-500">
                          {formatDate(v.createdAt, lang)}
                        </td>
                        <td className="py-3 pr-4 font-medium">{v.visitorName}</td>
                        <td className="py-3 pr-4 text-slate-600">{v.hostStaff.name}</td>
                        <td className="py-3">
                          <Badge color={st.color}>{st.label}</Badge>
                        </td>
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
