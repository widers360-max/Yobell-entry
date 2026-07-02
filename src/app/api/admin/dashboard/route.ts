import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const trendStart = new Date(today);
    trendStart.setDate(trendStart.getDate() - 6);

    const [
      todayVisits,
      pendingVisits,
      respondedVisits,
      monthVisits,
      staffCount,
      latestVisits,
      settings,
      companies,
      healthCheck,
      trendVisits,
      respondedWithTime,
    ] = await Promise.all([
      prisma.visit.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.visit.count({ where: { status: "pending" } }),
      prisma.visit.count({
        where: { status: { not: "pending" } },
      }),
      prisma.visit.count({
        where: { createdAt: { gte: monthStart } },
      }),
      prisma.staff.count({ where: { active: true } }),
      prisma.visit.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          hostStaff: { include: { company: true } },
        },
      }),
      prisma.kioskSetting.findUnique({ where: { id: "default" } }),
      prisma.company.count({ where: { active: true } }),
      prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      prisma.visit.findMany({
        where: { createdAt: { gte: trendStart, lt: tomorrow } },
        select: { createdAt: true },
      }),
      prisma.visit.findMany({
        where: { respondedAt: { not: null } },
        select: { createdAt: true, respondedAt: true },
      }),
    ]);

    const trendDays: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(trendStart);
      day.setDate(day.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const count = trendVisits.filter(
        (v) => v.createdAt >= day && v.createdAt < next,
      ).length;
      trendDays.push({ date: key, count });
    }

    let avgResponseSeconds: number | null = null;
    if (respondedWithTime.length > 0) {
      const totalMs = respondedWithTime.reduce((sum, visit) => {
        return sum + (visit.respondedAt!.getTime() - visit.createdAt.getTime());
      }, 0);
      avgResponseSeconds = Math.round(totalMs / respondedWithTime.length / 1000);
    }

    return NextResponse.json({
      stats: {
        todayVisits,
        pending: pendingVisits,
        responded: respondedVisits,
        staffCount,
        companyCount: companies,
        monthVisits,
        avgResponseSeconds,
      },
      visitTrend: trendDays,
      latestVisits,
      kioskStatus: {
        online: true,
        database: healthCheck ? "connected" : "disconnected",
        camera: settings?.heroVideoUrl ? "video configured" : "browser camera",
        company: settings?.companyDisplayName ?? "—",
      },
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ダッシュボードの取得に失敗しました" },
      { status: 500 },
    );
  }
}
