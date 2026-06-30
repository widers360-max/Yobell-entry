import Link from "next/link";

export default function HomePage() {
  const now = new Date();

  return (
    <main className="kiosk-no-select flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-dark via-brand to-brand-light px-6 text-center text-white">
      <div className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-white/70">
        WIDERS Office
      </div>
      <h1 className="text-7xl font-black tracking-tight drop-shadow-lg sm:text-8xl">
        YOBELL
        <span className="ml-3 font-light">Entry</span>
      </h1>
      <p className="mt-6 text-2xl font-medium text-white/90">
        ようこそお越しくださいました
      </p>
      <p className="mt-2 text-lg text-white/70">
        画面にタッチして受付を開始してください
      </p>

      <Link
        href="/checkin"
        className="touch-btn mt-12 animate-pulse bg-white px-16 py-8 text-3xl text-brand-dark shadow-2xl hover:bg-slate-50"
      >
        タッチして受付を開始 →
      </Link>

      <div className="mt-16 text-base text-white/60">
        {now.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </div>

      <div className="absolute bottom-12 flex gap-4 text-xs text-white/50">
        <Link href="/staff" className="hover:text-white/80">
          スタッフ画面
        </Link>
        <span>/</span>
        <Link href="/admin" className="hover:text-white/80">
          管理画面
        </Link>
      </div>
    </main>
  );
}
