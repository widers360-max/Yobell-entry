import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    todayVisits,
    pendingVisits,
    respondedVisits,
    staffCount,
    latestVisits,
    settings,
    companies,
    healthCheck,
  ] = await Promise.all([
    prisma.visit.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.visit.count({ where: { status: "pending" } }),
    prisma.visit.count({
      where: { status: { not: "pending" } },
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
  ]);

  return NextResponse.json({
    stats: {
      todayVisits,
      pending: pendingVisits,
      responded: respondedVisits,
      staffCount,
      companyCount: companies,
    },
    latestVisits,
    kioskStatus: {
      online: true,
      database: healthCheck ? "connected" : "disconnected",
      camera: settings?.heroVideoUrl ? "video configured" : "browser camera",
      company: settings?.companyDisplayName ?? "—",
    },
    settings,
  });
}
