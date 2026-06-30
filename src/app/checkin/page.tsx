"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import WebcamCapture from "@/components/WebcamCapture";
import { VISITOR_TYPES, type VisitorTypeKey } from "@/lib/constants";

type Staff = {
  id: string;
  name: string;
  department: string | null;
  title: string | null;
};

type Company = {
  id: string;
  name: string;
  nameKana: string | null;
  staff: Staff[];
};

type Step = "type" | "company" | "staff" | "form" | "done";

export default function CheckinPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<Step>("type");
  const [visitorType, setVisitorType] = useState<VisitorTypeKey | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);

  const [visitorName, setVisitorName] = useState("");
  const [visitorCompany, setVisitorCompany] = useState("");
  const [purpose, setPurpose] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => setCompanies(data.companies ?? []))
      .catch(() => setError("会社情報の取得に失敗しました。"))
      .finally(() => setLoading(false));
  }, []);

  const progress = useMemo(() => {
    const order: Step[] = ["type", "company", "staff", "form"];
    const idx = order.indexOf(step);
    return idx < 0 ? 100 : ((idx + 1) / order.length) * 100;
  }, [step]);

  function reset() {
    setStep("type");
    setVisitorType(null);
    setCompany(null);
    setStaff(null);
    setVisitorName("");
    setVisitorCompany("");
    setPurpose("");
    setPartySize(1);
    setPhoto(null);
    setError(null);
  }

  async function submit() {
    if (!visitorName.trim()) {
      setError("お名前を入力してください。");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName,
          visitorCompany,
          visitorType,
          purpose,
          partySize,
          staffId: staff?.id ?? null,
          photoData: photo,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "受付に失敗しました。");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "受付に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-24 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-slate-500 hover:text-brand">
          ← 中止してトップへ
        </Link>
        <span className="text-lg font-black text-brand">YOBELL Entry</span>
      </header>

      {step !== "done" && (
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-center text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-20 text-center text-slate-400">読み込み中...</p>
      ) : step === "type" ? (
        <section>
          <h1 className="mb-6 text-center text-3xl font-bold">
            ご用件をお選びください
          </h1>
          <div className="grid gap-4 sm:grid-cols-2">
            {VISITOR_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setVisitorType(t.key);
                  setStep("company");
                }}
                className="touch-btn flex items-center gap-4 bg-white text-left hover:bg-brand/5"
              >
                <span className="text-4xl">{t.icon}</span>
                <span>
                  <span className="block text-xl text-slate-900">{t.label}</span>
                  <span className="block text-sm font-normal text-slate-500">
                    {t.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : step === "company" ? (
        <section>
          <h1 className="mb-6 text-center text-3xl font-bold">
            訪問先の会社をお選びください
          </h1>
          <div className="grid gap-4">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCompany(c);
                  setStep("staff");
                }}
                className="touch-btn bg-white text-left hover:bg-brand/5"
              >
                <span className="block text-2xl text-slate-900">{c.name}</span>
                {c.nameKana && (
                  <span className="block text-sm font-normal text-slate-400">
                    {c.nameKana}
                  </span>
                )}
              </button>
            ))}
          </div>
          <BackButton onClick={() => setStep("type")} />
        </section>
      ) : step === "staff" ? (
        <section>
          <h1 className="mb-2 text-center text-3xl font-bold">
            ご担当者をお選びください
          </h1>
          <p className="mb-6 text-center text-slate-500">{company?.name}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {company?.staff.length ? (
              company.staff.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStaff(s);
                    setStep("form");
                  }}
                  className="touch-btn bg-white text-left hover:bg-brand/5"
                >
                  <span className="block text-xl text-slate-900">{s.name}</span>
                  <span className="block text-sm font-normal text-slate-500">
                    {[s.department, s.title].filter(Boolean).join(" / ")}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-slate-400">担当者が登録されていません。</p>
            )}
            <button
              onClick={() => {
                setStaff(null);
                setStep("form");
              }}
              className="touch-btn border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600"
            >
              担当者がわからない
            </button>
          </div>
          <BackButton onClick={() => setStep("company")} />
        </section>
      ) : step === "form" ? (
        <section>
          <h1 className="mb-6 text-center text-3xl font-bold">
            お客様情報のご入力
          </h1>
          <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="お名前" required>
              <input
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="山田 太郎"
                className="input"
              />
            </Field>
            <Field label="会社・団体名">
              <input
                value={visitorCompany}
                onChange={(e) => setVisitorCompany(e.target.value)}
                placeholder="株式会社サンプル"
                className="input"
              />
            </Field>
            <Field label="ご用件・備考">
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
                className="input"
              />
            </Field>
            <Field label="人数">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                  className="h-12 w-12 rounded-full bg-slate-200 text-2xl font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center text-2xl font-bold">
                  {partySize}
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize((n) => Math.min(20, n + 1))}
                  className="h-12 w-12 rounded-full bg-slate-200 text-2xl font-bold"
                >
                  ＋
                </button>
                <span className="text-slate-500">名</span>
              </div>
            </Field>

            <div className="border-t pt-5">
              <p className="mb-3 text-sm font-bold text-slate-600">
                お顔写真（任意）
              </p>
              <WebcamCapture photo={photo} onCapture={setPhoto} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("staff")}
              className="touch-btn flex-1 bg-slate-200 text-slate-700"
            >
              戻る
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="touch-btn flex-[2] bg-brand text-white disabled:opacity-50"
            >
              {submitting ? "送信中..." : "この内容で呼び出す"}
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 text-7xl">✅</div>
          <h1 className="text-3xl font-bold text-green-700">
            受付が完了しました
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            担当者が参ります。
            <br />
            少々お待ちくださいませ。
          </p>
          {staff && (
            <p className="mt-4 rounded-xl bg-slate-100 px-6 py-3 text-slate-700">
              {company?.name} / {staff.name} を呼び出しました
            </p>
          )}
          <div className="mt-10 flex gap-3">
            <button
              onClick={reset}
              className="touch-btn bg-brand px-10 text-white"
            >
              続けて受付する
            </button>
            <Link href="/" className="touch-btn bg-slate-200 px-10 text-slate-700">
              トップへ
            </Link>
          </div>
        </section>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          padding: 0.85rem 1rem;
          font-size: 1.1rem;
          outline: none;
        }
        .input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full rounded-xl bg-slate-200 py-3 font-bold text-slate-700"
    >
      戻る
    </button>
  );
}
