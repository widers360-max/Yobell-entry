"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminCard, AdminInput, AdminTextarea, Btn, Badge } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";

interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  welcomeMessage: string | null;
  active: boolean;
  _count: { staff: number };
}

export function CompaniesSection({
  companies,
  onRefresh,
  onMessage,
}: {
  companies: Company[];
  onRefresh: () => void;
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const { t } = useAdminI18n();
  const [editing, setEditing] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", logoUrl: "", welcomeMessage: "", active: true });

  function resetForm() {
    setForm({ name: "", logoUrl: "", welcomeMessage: "", active: true });
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    if (!form.name.trim()) {
      onMessage(t("msg_companyRequired"), "error");
      return;
    }
    const payload = {
      name: form.name.trim(),
      logoUrl: form.logoUrl || null,
      welcomeMessage: form.welcomeMessage || null,
      active: form.active,
    };
    const res = editing
      ? await fetch(`/api/companies/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (!res.ok) {
      const err = await res.json();
      onMessage(err.error ?? t("msg_saveFailed"), "error");
      return;
    }
    onMessage(editing ? t("msg_companyUpdated") : t("msg_companyAdded"));
    resetForm();
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm(t("confirm_deleteCompany"))) return;
    const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      onMessage(err.error ?? t("msg_deleteFailed"), "error");
      return;
    }
    onMessage(t("msg_companyDeleted"));
    onRefresh();
  }

  function startEdit(c: Company) {
    setEditing(c);
    setCreating(false);
    setForm({
      name: c.name,
      logoUrl: c.logoUrl ?? "",
      welcomeMessage: c.welcomeMessage ?? "",
      active: c.active,
    });
  }

  return (
    <div className="space-y-6">
      {(creating || editing) && (
        <AdminCard title={editing ? t("companies_edit") : t("companies_add")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label={`${t("field_companyName")} *`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <AdminInput
              label={t("field_logoUrl")}
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            />
            <div className="sm:col-span-2">
              <AdminTextarea
                label={t("field_welcomeMessage")}
                rows={2}
                value={form.welcomeMessage}
                onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              {t("active")}
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save}>{t("save")}</Btn>
            <Btn variant="secondary" onClick={resetForm}>
              {t("cancel")}
            </Btn>
          </div>
        </AdminCard>
      )}

      <AdminCard
        title={`${t("companies_list")} (${companies.length})`}
        action={
          !creating && !editing ? (
            <Btn
              size="sm"
              onClick={() => {
                setCreating(true);
                setEditing(null);
              }}
            >
              <Plus className="h-4 w-4" />
              {t("add")}
            </Btn>
          ) : null
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">{t("col_company")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_staffCount")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_status")}</th>
                <th className="pb-3 font-medium">{t("col_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4">{c._count.staff}</td>
                  <td className="py-3 pr-4">
                    <Badge color={c.active ? "green" : "gray"}>
                      {c.active ? t("active") : t("inactive")}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(c.id)}
                        disabled={c._count.staff > 0}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
