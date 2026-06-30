import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const active = searchParams.get("active");
  const take = Number(searchParams.get("take") ?? "200");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (active === "true") where.status = { in: ["WAITING", "ACKNOWLEDGED", "ON_THE_WAY"] };

  const visits = await prisma.visit.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Number.isFinite(take) ? take : 200,
    include: { staff: { include: { company: true } } },
  });

  return NextResponse.json({ visits });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      visitorName,
      visitorCompany,
      visitorType,
      purpose,
      partySize,
      staffId,
      photoData,
    } = body ?? {};

    if (!visitorName || typeof visitorName !== "string") {
      return NextResponse.json(
        { error: "お名前を入力してください。" },
        { status: 400 },
      );
    }

    if (staffId) {
      const staff = await prisma.staff.findUnique({ where: { id: staffId } });
      if (!staff) {
        return NextResponse.json(
          { error: "担当者が見つかりません。" },
          { status: 404 },
        );
      }
    }

    const visit = await prisma.visit.create({
      data: {
        visitorName: visitorName.trim(),
        visitorCompany: visitorCompany?.trim() || null,
        visitorType: visitorType || "APPOINTMENT",
        purpose: purpose?.trim() || null,
        partySize: Number(partySize) > 0 ? Number(partySize) : 1,
        staffId: staffId || null,
        photoData: photoData || null,
        status: "WAITING",
      },
      include: { staff: { include: { company: true } } },
    });

    return NextResponse.json({ visit }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "受付に失敗しました。" },
      { status: 500 },
    );
  }
}
