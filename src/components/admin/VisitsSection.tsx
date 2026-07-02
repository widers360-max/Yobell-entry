"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge, formatDate, AdminTable, AdminLoading, AdminEmptyState } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";
import {
  getStatusLabel,
  getVisitorTypeLabel,
  getInputMethodLabel,
  formatPurgeConfirm,
  formatPurgeSuccess,
} from "@/lib/admin-i18n";

interface Visit {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorPhone: string | null;
  visitorType: string;
  inputMethod: string;
  status: string;
  photoData: string | null;
  notificationSent: boolean;
  notificationError: string | null;
  createdAt: string;
  hostStaff: { name: string; company: { name: string } };
}

function notificationLabel(
  t: (key: import("@/lib/admin-i18n").AdminTranslationKey) => string,
  visit: Visit
): { label: string; color: "green" | "amber" | "gray" | "red" } {
  if (visit.notificationSent) {
    return { label: t("notification_sent"), color: "green" };
  }
  if (visit.notificationError === "Staff email not set") {
    return { label: t("notification_no_email"), color: "gray" };
  }
  if (visit.notificationError) {
    return { label: t("notification_failed"), color: "red" };
  }
  return { label: t("notification_failed"), color: "amber" };
}

const VISITOR_TYPES = [
  "meeting",
  "delivery",
  "interview",
  "maintenance",
  "reception",
  "tour",
  "other",
] as const;

const STATUS_OPTIONS = [
  "pending",
  "accepted",
  "please_wait",
  "declined",
  "no_response",
] as const;

export function VisitsSection({
  retentionDays,
  onMessage,
}: {
  retentionDays: number;
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const { lang, t } = useAdminI18n();
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
    if (!confirm(formatPurgeConfirm(lang, retentionDays))) return;
    const res = await fetch("/api/visits/purge", { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      onMessage(t("msg_purgeFailed"), "error");
      return;
    }
    onMessage(formatPurgeSuccess(lang, data.deleted));
    loadVisits();
  }

  return (
    <div className="admin-page-stack">
      <AdminCard title={t("visits_filter")} description={t("visits_filterDesc")}>
        <div className="admin-filter-bar">
          <AdminInput
            label={t("visits_searchVisitor")}
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder={t("visits_searchHint")}
          />
          <AdminInput
            label={t("visits_searchHost")}
            value={filters.host}
            onChange={(e) => setFilters({ ...filters, host: e.target.value })}
            placeholder={t("visits_searchHint")}
          />
          <AdminSelect
            label={t("visits_statusFilter")}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">{t("visits_statusAll")}</option>
            {STATUS_OPTIONS.map((status) => {
              const st = getStatusLabel(lang, status);
              return (
                <option key={status} value={status}>
                  {st.label}
                </option>
              );
            })}
          </AdminSelect>
          <AdminSelect
            label={t("visits_typeFilter")}
            value={filters.visitorType}
            onChange={(e) => setFilters({ ...filters, visitorType: e.target.value })}
          >
            <option value="">{t("visits_typeAll")}</option>
            {VISITOR_TYPES.map((type) => (
              <option key={type} value={type}>
                {getVisitorTypeLabel(lang, type)}
              </option>
            ))}
          </AdminSelect>
          <AdminInput
            label={t("visits_dateFrom")}
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
          <AdminInput
            label={t("visits_dateTo")}
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
        <div className="admin-filter-actions">
          <Btn onClick={loadVisits} disabled={loading}>
            <Search className="h-4 w-4" />
            {loading ? t("searching") : t("search")}
          </Btn>
          <a href="/api/visits/export" className="inline-flex">
            <Btn variant="secondary">
              <Download className="h-4 w-4" />
              {t("visits_exportCsv")}
            </Btn>
          </a>
          <Btn variant="danger" onClick={purgeOld}>
            <Trash2 className="h-4 w-4" />
            {t("visits_purgeOld")}
          </Btn>
        </div>
      </AdminCard>

      <AdminCard title={`${t("visits_list")} (${visits.length})`}>
        {loading ? (
          <AdminLoading label={t("searching")} />
        ) : visits.length === 0 ? (
          <AdminEmptyState title={t("visits_noResults")} />
        ) : (
          <AdminTable>
            <thead>
              <tr>
                <th>{t("col_datetime")}</th>
                <th>{t("col_photo")}</th>
                <th>{t("col_visitor")}</th>
                <th>{t("col_company")}</th>
                <th>{t("col_type")}</th>
                <th>{t("col_inputMethod")}</th>
                <th>{t("col_host")}</th>
                <th>{t("col_notification")}</th>
                <th>{t("col_status")}</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const st = getStatusLabel(lang, v.status);
                const notify = notificationLabel(t, v);
                return (
                  <tr key={v.id}>
                    <td className="whitespace-nowrap text-yobell-muted">
                      {formatDate(v.createdAt, lang)}
                    </td>
                    <td>
                      {v.photoData ? (
                        <img
                          src={v.photoData}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yobell-bg text-xs text-yobell-muted">
                          —
                        </div>
                      )}
                    </td>
                    <td className="font-semibold text-yobell-navy">{v.visitorName}</td>
                    <td>{v.visitorCompany ?? "—"}</td>
                    <td>{getVisitorTypeLabel(lang, v.visitorType)}</td>
                    <td>{getInputMethodLabel(lang, v.inputMethod ?? "manual")}</td>
                    <td>{v.hostStaff.name}</td>
                    <td>
                      <Badge color={notify.color}>{notify.label}</Badge>
                      {v.notificationError && !v.notificationSent && (
                        <p
                          className="mt-1 max-w-[140px] truncate text-xs text-yobell-muted"
                          title={v.notificationError}
                        >
                          {v.notificationError}
                        </p>
                      )}
                    </td>
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
