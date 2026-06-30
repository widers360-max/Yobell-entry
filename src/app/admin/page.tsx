"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Tab = "companies" | "staff" | "visits" | "settings";

interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  welcomeMessage: string | null;
  _count: { staff: number };
}

interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  companyId: string;
  company: { name: string };
}

interface Visit {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  status: string;
  createdAt: string;
  hostStaff: { name: string; company: { name: string } };
}

interface Settings {
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  welcomeMessage: string;
  languageDefault: string;
  retentionDays: number;
  privacyNotice: string;
  fallbackMessage: string;
}

const VISITOR_TYPE_LABELS: Record<string, string> = {
  meeting: "打ち合わせ",
  delivery: "配達",
  interview: "面接",
  maintenance: "工事・点検",
  other: "その他",
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadData = useCallback(async () => {
    const [compRes, staffRes, visitRes, settingsRes] = await Promise.all([
      fetch("/api/companies"),
      fetch("/api/staff?active=false"),
      fetch("/api/visits"),
      fetch("/api/settings"),
    ]);
    setCompanies(await compRes.json());
    setStaff(await staffRes.json());
    setVisits(await visitRes.json());
    setSettings(await settingsRes.json());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "companies", label: "会社管理" },
    { key: "staff", label: "スタッフ管理" },
    { key: "visits", label: "来訪ログ" },
    { key: "settings", label: "キオスク設定" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-[var(--yobell-primary)] px-6 py-4 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">YOBELL Entry — 管理画面</h1>
            <p className="text-sm text-blue-200">Admin Dashboard</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10">
              キオスク
            </Link>
            <Link href="/staff" className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10">
              スタッフ通知
            </Link>
            <Link href="/health" className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10">
              ヘルスチェック
            </Link>
          </div>
        </div>
      </header>

      {message && (
        <div className="bg-green-600 px-6 py-2 text-center text-sm font-medium text-white">
          {message}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-6">
        <nav className="mb-6 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "bg-white text-[var(--yobell-primary)] shadow"
                  : "text-gray-600 hover:bg-white/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "companies" && (
          <CompaniesTab
            companies={companies}
            onRefresh={loadData}
            onMessage={showMessage}
          />
        )}
        {tab === "staff" && (
          <StaffTab
            staff={staff}
            companies={companies}
            onRefresh={loadData}
            onMessage={showMessage}
          />
        )}
        {tab === "visits" && <VisitsTab visits={visits} />}
        {tab === "settings" && settings && (
          <SettingsTab
            settings={settings}
            onRefresh={loadData}
            onMessage={showMessage}
          />
        )}
      </div>
    </div>
  );
}

function CompaniesTab({
  companies,
  onRefresh,
  onMessage,
}: {
  companies: Company[];
  onRefresh: () => void;
  onMessage: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function add() {
    if (!name.trim()) return;
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    onRefresh();
    onMessage("会社を追加しました");
  }

  async function update(id: string) {
    await fetch(`/api/companies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditing(null);
    onRefresh();
    onMessage("会社を更新しました");
  }

  async function remove(id: string) {
    if (!confirm("この会社と所属スタッフを削除しますか？")) return;
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    onRefresh();
    onMessage("会社を削除しました");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">会社を追加</h2>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="会社名"
            className="admin-input flex-1"
          />
          <button type="button" onClick={add} className="admin-btn-primary">
            追加
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-6 py-3">会社名</th>
              <th className="px-6 py-3">スタッフ数</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-6 py-4">
                  {editing === c.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                </td>
                <td className="px-6 py-4">{c._count.staff}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editing === c.id ? (
                      <button
                        type="button"
                        onClick={() => update(c.id)}
                        className="admin-btn-primary"
                      >
                        保存
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(c.id);
                          setEditName(c.name);
                        }}
                        className="admin-btn-secondary"
                      >
                        編集
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="admin-btn-danger"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffTab({
  staff,
  companies,
  onRefresh,
  onMessage,
}: {
  staff: StaffMember[];
  companies: Company[];
  onRefresh: () => void;
  onMessage: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    companyId: "",
    department: "",
    role: "",
    email: "",
    phone: "",
  });

  async function add() {
    if (!form.name || !form.companyId) return;
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", companyId: "", department: "", role: "", email: "", phone: "" });
    onRefresh();
    onMessage("スタッフを追加しました");
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm("このスタッフを削除しますか？")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    onRefresh();
    onMessage("スタッフを削除しました");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">スタッフを追加</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="名前"
            className="admin-input"
          />
          <select
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            className="admin-input"
          >
            <option value="">会社を選択</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="部署"
            className="admin-input"
          />
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="役職"
            className="admin-input"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="メール"
            className="admin-input"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="電話番号"
            className="admin-input"
          />
        </div>
        <button type="button" onClick={add} className="admin-btn-primary mt-4">
          追加
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-6 py-3">名前</th>
              <th className="px-6 py-3">会社</th>
              <th className="px-6 py-3">部署 / 役職</th>
              <th className="px-6 py-3">状態</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{s.company.name}</td>
                <td className="px-6 py-4">
                  {s.department} / {s.role}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.active ? "有効" : "無効"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(s.id, s.active)}
                      className="admin-btn-secondary"
                    >
                      {s.active ? "無効化" : "有効化"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="admin-btn-danger"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VisitsTab({ visits }: { visits: Visit[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">来訪ログ ({visits.length}件)</h2>
        <a href="/api/visits/export" className="admin-btn-primary">
          CSVエクスポート
        </a>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-6 py-3">日時</th>
              <th className="px-6 py-3">来訪者</th>
              <th className="px-6 py-3">会社</th>
              <th className="px-6 py-3">種別</th>
              <th className="px-6 py-3">担当者</th>
              <th className="px-6 py-3">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id} className="border-b last:border-0">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(v.createdAt).toLocaleString("ja-JP")}
                </td>
                <td className="px-6 py-4 font-medium">{v.visitorName}</td>
                <td className="px-6 py-4">{v.visitorCompany ?? "—"}</td>
                <td className="px-6 py-4">
                  {VISITOR_TYPE_LABELS[v.visitorType] ?? v.visitorType}
                </td>
                <td className="px-6 py-4">
                  {v.hostStaff.name}
                  <span className="text-gray-400">
                    {" "}
                    ({v.hostStaff.company.name})
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
            {visits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  来訪ログはまだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onRefresh,
  onMessage,
}: {
  settings: Settings;
  onRefresh: () => void;
  onMessage: (msg: string) => void;
}) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  async function save() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onRefresh();
    onMessage("設定を保存しました");
  }

  const fields: { key: keyof Settings; label: string; type?: string }[] = [
    { key: "brandName", label: "ブランド名" },
    { key: "tagline", label: "タグライン" },
    { key: "welcomeMessage", label: "ウェルカムメッセージ" },
    { key: "logoUrl", label: "ロゴURL" },
    { key: "languageDefault", label: "デフォルト言語 (ja/en/ko)" },
    { key: "retentionDays", label: "ログ保持日数", type: "number" },
    { key: "privacyNotice", label: "プライバシー通知文" },
    { key: "fallbackMessage", label: "フォールバックメッセージ" },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold">キオスク設定</h2>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              {f.label}
            </label>
            {f.key === "privacyNotice" || f.key === "fallbackMessage" ? (
              <textarea
                value={String(form[f.key] ?? "")}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                rows={3}
                className="admin-input"
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={String(form[f.key] ?? "")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f.key]:
                      f.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="admin-input"
              />
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={save} className="admin-btn-primary mt-6">
        保存
      </button>
    </div>
  );
}
