import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { staff: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const company = await prisma.company.create({
    data: {
      name: body.name,
      logoUrl: body.logoUrl ?? null,
      welcomeMessage: body.welcomeMessage ?? null,
    },
  });
  return NextResponse.json(company, { status: 201 });
}
