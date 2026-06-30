import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  const staff = await prisma.staff.findMany({
    where: {
      active: true,
      ...(companyId ? { companyId } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { company: true },
  });

  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyId, department, title, email, phone } = body ?? {};

    if (!name || !companyId) {
      return NextResponse.json(
        { error: "名前と会社は必須です。" },
        { status: 400 },
      );
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: "会社が見つかりません。" }, { status: 404 });
    }

    const maxOrder = await prisma.staff.aggregate({
      where: { companyId },
      _max: { sortOrder: true },
    });

    const staff = await prisma.staff.create({
      data: {
        name,
        companyId,
        department: department || null,
        title: title || null,
        email: email || null,
        phone: phone || null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ staff }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "作成に失敗しました。" },
      { status: 500 },
    );
  }
}
