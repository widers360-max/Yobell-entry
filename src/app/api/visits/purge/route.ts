import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const settings = await prisma.kioskSetting.findUnique({
    where: { id: "default" },
  });
  const retentionDays = settings?.retentionDays ?? 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  const result = await prisma.visit.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return NextResponse.json({
    ok: true,
    deleted: result.count,
    retentionDays,
    cutoff: cutoff.toISOString(),
  });
}
