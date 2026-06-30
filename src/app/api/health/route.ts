import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [companies, staff, visits, settings] = await Promise.all([
      prisma.company.count(),
      prisma.staff.count({ where: { active: true } }),
      prisma.visit.count(),
      prisma.kioskSetting.findUnique({ where: { id: "default" } }),
    ]);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      counts: { companies, staff, visits },
      settings: settings
        ? { brandName: settings.brandName, languageDefault: settings.languageDefault }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
