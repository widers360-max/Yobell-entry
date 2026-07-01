import { NextResponse } from "next/server";
import { execSync } from "node:child_process";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "本番環境では利用できません" },
      { status: 403 }
    );
  }

  try {
    execSync("npx tsx prisma/seed.ts", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    return NextResponse.json({ ok: true, message: "シードデータを再投入しました" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "シードの再投入に失敗しました",
        detail: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
