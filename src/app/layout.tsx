import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOBELL Entry - 受付システム",
  description: "タッチ操作対応のオフィス受付システム",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        {children}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center gap-1 border-t border-slate-200 bg-white/90 px-2 py-1 text-xs text-slate-500 backdrop-blur print:hidden">
          <Link href="/" className="rounded px-3 py-1 hover:bg-slate-100">
            受付
          </Link>
          <Link href="/checkin" className="rounded px-3 py-1 hover:bg-slate-100">
            来訪受付
          </Link>
          <Link href="/staff" className="rounded px-3 py-1 hover:bg-slate-100">
            スタッフ
          </Link>
          <Link href="/admin" className="rounded px-3 py-1 hover:bg-slate-100">
            管理
          </Link>
          <Link href="/health" className="rounded px-3 py-1 hover:bg-slate-100">
            状態
          </Link>
        </nav>
      </body>
    </html>
  );
}
