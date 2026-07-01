import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { staff: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "会社一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "会社の作成に失敗しました" },
      { status: 500 }
    );
  }
}
