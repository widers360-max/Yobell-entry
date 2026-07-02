"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, UserX } from "lucide-react";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge } from "./ui";
import { useAdminI18n } from "./AdminI18nProvider";
import { normalizeStaffStatus } from "@/lib/staff-utils";

interface Company {
  id: string;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string | null;
  phone: string | null;
  notificationMethod: string;
  staffStatus: string;
  active: boolean;
  companyId: string;
  company: { name: string };
}

const EMPTY = {
  name: "",
  companyId: "",
  department: "",
  role: "",
  email: "",
  phone: "",
  notificationMethod: "email",
  staffStatus: "available",
  active: true,
};

export function StaffSection({
  staff,
  companies,
  onRefresh,
  onMessage,
}: {
  staff: StaffMember[];
  companies: Company[];
  onRefresh: () => void;
  onMessage: (msg: string, type?: "success" | "error") => void;
}) {
  const { t } = useAdminI18n();
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);

  function resetForm() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    if (!form.name.trim() || !form.companyId) {
      onMessage(t("msg_staffRequired"), "error");
      return;
    }
    const payload = { ...form, email: form.email || null, phone: form.phone || null };
    const res = editing
      ? await fetch(`/api/staff/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (!res.ok) {
      onMessage(t("msg_saveFailed"), "error");
      return;
    }
    onMessage(editing ? t("msg_staffUpdated") : t("msg_staffAdded"));
    resetForm();
    onRefresh();
  }

  async function toggleActive(s: StaffMember) {
    await fetch(`/api/staff/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    onMessage(s.active ? t("msg_staffDeactivated") : t("msg_staffActivated"));
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm(t("confirm_deleteStaff"))) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    onMessage(t("msg_staffDeleted"));
    onRefresh();
  }

  function startEdit(s: StaffMember) {
    setEditing(s);
    setCreating(false);
    setForm({
      name: s.name,
      companyId: s.companyId,
      department: s.department,
      role: s.role,
      email: s.email ?? "",
      phone: s.phone ?? "",
      notificationMethod: s.notificationMethod,
      staffStatus: s.staffStatus ?? "available",
      active: s.active,
    });
  }

  return (
    <div className="space-y-6">
      {(creating || editing) && (
        <AdminCard title={editing ? t("staff_edit") : t("staff_add")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label={`${t("field_name")} *`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <AdminSelect
              label={`${t("col_company")} *`}
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            >
              <option value="">{t("selectPlaceholder")}</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </AdminSelect>
            <AdminInput
              label={t("field_department")}
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <AdminInput
              label={t("field_role")}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <AdminInput
              label={t("field_email")}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <AdminInput
              label={t("field_phone")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <AdminSelect
              label={t("field_notificationMethod")}
              value={form.notificationMethod}
              onChange={(e) => setForm({ ...form, notificationMethod: e.target.value })}
            >
              <option value="email">{t("notify_email")}</option>
              <option value="line_works">{t("notify_line_works")}</option>
              <option value="slack">{t("notify_slack")}</option>
              <option value="teams">{t("notify_teams")}</option>
              <option value="phone">{t("notify_phone")}</option>
              <option value="dashboard">{t("notify_dashboard")}</option>
            </AdminSelect>
            <AdminSelect
              label={t("field_staffStatus")}
              value={form.staffStatus}
              onChange={(e) => setForm({ ...form, staffStatus: e.target.value })}
            >
              <option value="available">{t("staffStatus_available")}</option>
              <option value="meeting">{t("staffStatus_meeting")}</option>
              <option value="away">{t("staffStatus_away")}</option>
              <option value="unavailable">{t("staffStatus_unavailable")}</option>
            </AdminSelect>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
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
        title={`${t("staff_list")} (${staff.length})`}
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
                <th className="pb-3 pr-4 font-medium">{t("field_name")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_company")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_department")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_contact")}</th>
                <th className="pb-3 pr-4 font-medium">{t("field_staffStatus")}</th>
                <th className="pb-3 pr-4 font-medium">{t("col_status")}</th>
                <th className="pb-3 font-medium">{t("col_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="py-3 pr-4">{s.company.name}</td>
                  <td className="py-3 pr-4">
                    {s.department} / {s.role}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{s.email ?? s.phone ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge color="amber">
                      {t(
                        `staffStatus_${normalizeStaffStatus(s.staffStatus)}` as "staffStatus_available",
                      )}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge color={s.active ? "green" : "gray"}>
                      {s.active ? t("active") : t("inactive")}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(s)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => toggleActive(s)}>
                        <UserX className="h-3.5 w-3.5" />
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={() => remove(s.id)}>
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
