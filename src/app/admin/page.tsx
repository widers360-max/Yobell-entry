"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  VISIT_STATUS,
  visitorTypeLabel,
  type VisitStatusKey,
} from "@/lib/constants";

type Staff = {
  id: string;
  name: string;
  department: string | null;
  title: string | null;
  email: string | null;
  company: { id: string; name: string };
};

type Company = {
  id: string;
  name: string;
  staff: Staff[];
};

type Visit = {
  id: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  purpose: string | null;
  partySize: number;
  status: VisitStatusKey;
  createdAt: string;
  staff: { name: string; company: { name: string } } | null;
};

type Tab = "logs" | "staff";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("logs");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    companyId: "",
    department: "",
    title: "",
    email: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const loadVisits = useCallback(async () => {
    const res = await fetch("/api/visits?take=500", { cache: "no-store" });
    const data = await res.json();
    setVisits(data.visits ?? []);
  }, []);

  const loadCompanies = useCallback(async () => {
    const res = await fetch("/api/companies", { cache: "no-store" });
    const data = await res.json();
    setCompanies(data.companies ?? []);
    if (data.companies?.[0]?.id) {
      setForm((f) => (f.companyId ? f : { ...f, companyId: data.companies[0].id }));
    }
  }, []);

  useEffect(() => {
    Promise.all([loadVisits(), loadCompanies()]).finally(() =>
      setLoading(false),
    );
  }, [loadVisits, loadCompanies]);

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.companyId) {
      setFormError("名前と会社は必須です。");
      return;
    }
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFormError(data.error ?? "登録に失敗しました。");
      return;
    }
    setForm((f) => ({
      ...f,
      name: "",
      department: "",
      title: "",
      email: "",
    }));
    await loadCompanies();
  }

  async function removeStaff(id: string) {
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    await loadCompanies();
  }

  const allStaff = companies.flatMap((c) => c.staff);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理画面</h1>
        <Link href="/" className="text-sm text-slate-500 hover:text-brand">
          トップへ
        </Link>
      </header>

      <div className="mb-6 flex gap-2">
        <TabButton active={tab === "logs"} onClick={() => setTab("logs")}>
          来訪ログ（{visits.length}）
        </TabButton>
        <TabButton active={tab === "staff"} onClick={() => setTab("staff")}>
          スタッフ管理（{allStaff.length}）
        </TabButton>
      </div>

      {loading ? (
        <p className="py-20 text-center text-slate-400">読み込み中...</p>
      ) : tab === "logs" ? (
        <section>
          <div className="mb-4 flex justify-end">
            <a
              href="/api/visits/export"
              className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
            >
              CSV エクスポート ⬇
            </a>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <Th>受付日時</Th>
                  <Th>来訪者</Th>
                  <Th>会社</Th>
                  <Th>区分</Th>
                  <Th>訪問先</Th>
                  <Th>人数</Th>
                  <Th>状態</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      来訪記録がありません。
                    </td>
                  </tr>
                ) : (
                  visits.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <Td>{new Date(v.createdAt).toLocaleString("ja-JP")}</Td>
                      <Td className="font-bold">{v.visitorName}</Td>
                      <Td>{v.visitorCompany || "—"}</Td>
                      <Td>{visitorTypeLabel(v.visitorType)}</Td>
                      <Td>
                        {v.staff
                          ? `${v.staff.company.name} / ${v.staff.name}`
                          : "—"}
                      </Td>
                      <Td>{v.partySize}</Td>
                      <Td>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-bold ${
                            (VISIT_STATUS[v.status] ?? VISIT_STATUS.WAITING)
                              .color
                          }`}
                        >
                          {(VISIT_STATUS[v.status] ?? VISIT_STATUS.WAITING)
                            .label}
                        </span>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <form
            onSubmit={addStaff}
            className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold">スタッフを追加</h2>
            {formError && (
              <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">
                {formError}
              </p>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-slate-600">
                会社 *
              </span>
              <select
                value={form.companyId}
                onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="名前 *"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="山田 太郎"
            />
            <Input
              label="部署"
              value={form.department}
              onChange={(v) => setForm({ ...form, department: v })}
              placeholder="営業部"
            />
            <Input
              label="役職"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
              placeholder="課長"
            />
            <Input
              label="メール"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="taro@example.jp"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-brand py-3 font-bold text-white"
            >
              追加する
            </button>
          </form>

          <div className="space-y-4">
            {companies.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 text-lg font-bold">
                  {c.name}
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    {c.staff.length}名
                  </span>
                </h3>
                <ul className="divide-y divide-slate-100">
                  {c.staff.length === 0 ? (
                    <li className="py-3 text-sm text-slate-400">
                      スタッフ未登録
                    </li>
                  ) : (
                    c.staff.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between py-2.5"
                      >
                        <div>
                          <div className="font-bold">{s.name}</div>
                          <div className="text-xs text-slate-500">
                            {[s.department, s.title].filter(Boolean).join(" / ")}
                            {s.email ? ` ・ ${s.email}` : ""}
                          </div>
                        </div>
                        <button
                          onClick={() => removeStaff(s.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100"
                        >
                          削除
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 font-bold transition ${
        active
          ? "bg-brand text-white shadow"
          : "bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 p-2.5"
      />
    </label>
  );
}
