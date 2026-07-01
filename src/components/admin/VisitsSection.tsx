"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge, formatDate } from "./ui";
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
  createdAt: string;
  hostStaff: { name: string; company: { name: string } };
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
    <div className="space-y-6">
      <AdminCard title={t("visits_filter")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-4 flex flex-wrap gap-2">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-3 font-medium">{t("col_datetime")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_photo")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_visitor")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_company")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_type")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_inputMethod")}</th>
                <th className="pb-3 pr-3 font-medium">{t("col_host")}</th>
                <th className="pb-3 font-medium">{t("col_status")}</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const st = getStatusLabel(lang, v.status);
                return (
                  <tr key={v.id} className="border-b border-slate-50">
                    <td className="py-3 pr-3 whitespace-nowrap text-slate-500">
                      {formatDate(v.createdAt, lang)}
                    </td>
                    <td className="py-3 pr-3">
                      {v.photoData ? (
                        <img
                          src={v.photoData}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          —
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-3 font-medium">{v.visitorName}</td>
                    <td className="py-3 pr-3">{v.visitorCompany ?? "—"}</td>
                    <td className="py-3 pr-3">{getVisitorTypeLabel(lang, v.visitorType)}</td>
                    <td className="py-3 pr-3">
                      <span className="font-medium text-slate-700">
                        {getInputMethodLabel(lang, v.inputMethod ?? "manual")}
                      </span>
                    </td>
                    <td className="py-3 pr-3">{v.hostStaff.name}</td>
                    <td className="py-3">
                      <Badge color={st.color}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {visits.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t("visits_noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
