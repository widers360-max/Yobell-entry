import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "会社名は必須です" }, { status: 400 });
  }
  const company = await prisma.company.create({
    data: {
      name: body.name.trim(),
      logoUrl: body.logoUrl ?? null,
      welcomeMessage: body.welcomeMessage ?? null,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(company, { status: 201 });
}
