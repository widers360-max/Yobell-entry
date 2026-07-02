"use client";

import {
  AdminCard,
  AdminEmptyState,
  AdminLoading,
  AdminTable,
  Badge,
  StatCard,
  formatDate,
  formatDuration,
} from "./ui";
import { VisitorTrendChart } from "./VisitorTrendChart";
import { useAdminI18n } from "./AdminI18nProvider";
import { getStatusLabel } from "@/lib/admin-i18n";

interface DashboardData {
  stats: {
    todayVisits: number;
    pending: number;
    responded: number;
    staffCount: number;
    companyCount: number;
    monthVisits: number;
    avgResponseSeconds: number | null;
  };
  visitTrend: Array<{ date: string; count: number }>;
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
    return <AdminLoading label={t("loading")} />;
  }

  const { stats, visitTrend, latestVisits, kioskStatus } = data;

  return (
    <div className="admin-page-stack">
      <div className="admin-stat-grid">
        <StatCard label={t("dash_todayVisits")} value={stats.todayVisits} accent="navy" />
        <StatCard label={t("dash_pending")} value={stats.pending} accent="amber" />
        <StatCard label={t("dash_responded")} value={stats.responded} accent="green" />
        <StatCard label={t("dash_staffCount")} value={stats.staffCount} accent="blue" />
        <StatCard
          label={t("dash_monthVisits")}
          value={stats.monthVisits}
          accent="gold"
        />
        <StatCard
          label={t("dash_avgResponse")}
          value={formatDuration(stats.avgResponseSeconds, t("dash_preparing"))}
          accent="navy"
          hint={stats.avgResponseSeconds === null ? t("dash_avgResponseHint") : undefined}
        />
      </div>

      <div className="admin-dashboard-grid">
        <AdminCard title={t("dash_visitTrend")} className="lg:col-span-2">
          <VisitorTrendChart data={visitTrend ?? []} />
        </AdminCard>

        <AdminCard title={t("dash_kioskStatus")}>
          <dl className="admin-status-list">
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
      </div>

      <AdminCard
        title={t("dash_latestVisits")}
        description={t("dash_latestVisitsDesc")}
      >
        {latestVisits.length === 0 ? (
          <AdminEmptyState title={t("dash_noVisits")} />
        ) : (
          <AdminTable>
            <thead>
              <tr>
                <th>{t("col_datetime")}</th>
                <th>{t("col_visitor")}</th>
                <th>{t("col_host")}</th>
                <th>{t("col_status")}</th>
              </tr>
            </thead>
            <tbody>
              {latestVisits.map((v) => {
                const st = getStatusLabel(lang, v.status);
                return (
                  <tr key={v.id}>
                    <td className="whitespace-nowrap text-yobell-muted">
                      {formatDate(v.createdAt, lang)}
                    </td>
                    <td className="font-semibold text-yobell-navy">{v.visitorName}</td>
                    <td>{v.hostStaff.name}</td>
                    <td>
                      <Badge color={st.color}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="admin-status-row">
      <dt>{label}</dt>
      <dd>
        <span className={`admin-status-dot ${ok ? "ok" : "bad"}`} />
        {value}
      </dd>
    </div>
  );
}
