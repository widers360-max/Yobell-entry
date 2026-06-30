import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  let database = "ok";
  let companies = 0;
  let staff = 0;
  let visits = 0;

  try {
    [companies, staff, visits] = await Promise.all([
      prisma.company.count(),
      prisma.staff.count(),
      prisma.visit.count(),
    ]);
  } catch (error) {
    database = "error";
    return NextResponse.json(
      {
        status: "error",
        database,
        message: error instanceof Error ? error.message : "unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    status: "ok",
    app: "YOBELL Entry",
    version: "0.1.0",
    database,
    counts: { companies, staff, visits },
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  });
}
