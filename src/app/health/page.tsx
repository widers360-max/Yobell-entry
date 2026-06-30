import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  let status = "ok";
  let message = "";
  let counts = { companies: 0, staff: 0, visits: 0 };

  try {
    const [companies, staff, visits] = await Promise.all([
      prisma.company.count(),
      prisma.staff.count(),
      prisma.visit.count(),
    ]);
    counts = { companies, staff, visits };
  } catch (error) {
    status = "error";
    message = error instanceof Error ? error.message : "unknown error";
  }

  const ok = status === "ok";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">アプリ状態 / Health</h1>

      <div
        className={`mb-6 flex items-center gap-3 rounded-2xl border p-5 ${
          ok
            ? "border-green-300 bg-green-50 text-green-800"
            : "border-red-300 bg-red-50 text-red-800"
        }`}
      >
        <span className="text-3xl">{ok ? "✅" : "❌"}</span>
        <div>
          <div className="text-xl font-bold">
            {ok ? "正常稼働中" : "エラー"}
          </div>
          <div className="text-sm opacity-80">
            データベース接続: {ok ? "OK" : message}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-4">
        <Stat label="会社" value={counts.companies} />
        <Stat label="スタッフ" value={counts.staff} />
        <Stat label="来訪記録" value={counts.visits} />
      </dl>

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
        <div>アプリ: YOBELL Entry v0.1.0</div>
        <div>時刻: {new Date().toLocaleString("ja-JP")}</div>
        <div className="mt-2">
          JSON エンドポイント:{" "}
          <Link href="/api/health" className="text-brand underline">
            /api/health
          </Link>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 font-bold text-white"
      >
        ← トップへ戻る
      </Link>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="text-3xl font-black text-brand">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
