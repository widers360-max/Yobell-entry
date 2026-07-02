"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminTable,
  AdminEmptyState,
  AdminFormActions,
  Btn,
  Badge,
} from "./ui";
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
          <AdminFormActions>
            <Btn onClick={save}>{t("save")}</Btn>
            <Btn variant="secondary" onClick={resetForm}>
              {t("cancel")}
            </Btn>
          </AdminFormActions>
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
        {companies.length === 0 ? (
          <AdminEmptyState title={t("companies_empty")} />
        ) : (
          <AdminTable>
            <thead>
              <tr>
                <th>{t("col_company")}</th>
                <th>{t("col_staffCount")}</th>
                <th>{t("col_status")}</th>
                <th>{t("col_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold text-yobell-navy">{c.name}</td>
                  <td>{c._count.staff}</td>
                  <td>
                    <Badge color={c.active ? "green" : "gray"}>
                      {c.active ? t("active") : t("inactive")}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(c.id)}
                        disabled={c._count.staff > 0}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-yobell-danger" />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
