"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, UserX } from "lucide-react";
import { AdminCard, AdminInput, AdminSelect, Btn, Badge } from "./ui";

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
  notificationMethod: "dashboard",
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
      onMessage("名前と会社は必須です", "error");
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
      onMessage("保存に失敗しました", "error");
      return;
    }
    onMessage(editing ? "スタッフを更新しました" : "スタッフを追加しました");
    resetForm();
    onRefresh();
  }

  async function toggleActive(s: StaffMember) {
    await fetch(`/api/staff/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    onMessage(s.active ? "スタッフを無効化しました" : "スタッフを有効化しました");
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm("このスタッフを削除しますか？")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    onMessage("スタッフを削除しました");
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
      active: s.active,
    });
  }

  return (
    <div className="space-y-6">
      {(creating || editing) && (
        <AdminCard title={editing ? "スタッフを編集" : "スタッフを追加"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput label="名前 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <AdminSelect label="会社 *" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
              <option value="">選択してください</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </AdminSelect>
            <AdminInput label="部署" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <AdminInput label="役職" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <AdminInput label="メール" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <AdminInput label="電話番号" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <AdminSelect label="通知方法" value={form.notificationMethod} onChange={(e) => setForm({ ...form, notificationMethod: e.target.value })}>
              <option value="dashboard">ダッシュボード</option>
              <option value="email">メール（将来）</option>
            </AdminSelect>
            <label className="flex items-center gap-2 text-sm self-end pb-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded" />
              有効
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={save}>保存</Btn>
            <Btn variant="secondary" onClick={resetForm}>キャンセル</Btn>
          </div>
        </AdminCard>
      )}

      <AdminCard
        title={`スタッフ一覧（${staff.length}名）`}
        action={!creating && !editing ? (
          <Btn size="sm" onClick={() => { setCreating(true); setEditing(null); }}>
            <Plus className="h-4 w-4" />追加
          </Btn>
        ) : null}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">名前</th>
                <th className="pb-3 pr-4 font-medium">会社</th>
                <th className="pb-3 pr-4 font-medium">部署 / 役職</th>
                <th className="pb-3 pr-4 font-medium">連絡先</th>
                <th className="pb-3 pr-4 font-medium">状態</th>
                <th className="pb-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="py-3 pr-4">{s.company.name}</td>
                  <td className="py-3 pr-4">{s.department} / {s.role}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.email ?? s.phone ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge color={s.active ? "green" : "gray"}>{s.active ? "有効" : "無効"}</Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(s)}><Pencil className="h-3.5 w-3.5" /></Btn>
                      <Btn variant="ghost" size="sm" onClick={() => toggleActive(s)}><UserX className="h-3.5 w-3.5" /></Btn>
                      <Btn variant="ghost" size="sm" onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Btn>
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
