import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const pending = searchParams.get("pending");

  const visits = await prisma.visit.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(pending === "true" ? { status: "pending" } : {}),
    },
    include: {
      hostStaff: { include: { company: true } },
    },
    orderBy: { createdAt: "desc" },
    take: pending === "true" ? 50 : 200,
  });

  return NextResponse.json(visits);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const visit = await prisma.visit.create({
    data: {
      visitorName: body.visitorName,
      visitorCompany: body.visitorCompany ?? null,
      visitorPhone: body.visitorPhone ?? null,
      purpose: body.purpose ?? null,
      visitorType: body.visitorType,
      hostStaffId: body.hostStaffId,
      photoData: body.photoData ?? null,
      status: "pending",
    },
    include: {
      hostStaff: { include: { company: true } },
    },
  });

  return NextResponse.json(visit, { status: 201 });
}
