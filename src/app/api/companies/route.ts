import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const companies = await prisma.company.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    include: {
      staff: {
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
  });

  return NextResponse.json({ companies });
}
