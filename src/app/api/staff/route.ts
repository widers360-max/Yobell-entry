import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const activeOnly = searchParams.get("active") !== "false";

    const staff = await prisma.staff.findMany({
      where: {
        ...(activeOnly ? { active: true } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { department: { contains: q } },
                { role: { contains: q } },
                { company: { name: { contains: q } } },
              ],
            }
          : {}),
      },
      include: { company: true },
      orderBy: [{ company: { name: "asc" } }, { name: "asc" }],
    });

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "スタッフ一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const staff = await prisma.staff.create({
      data: {
        companyId: body.companyId,
        name: body.name,
        department: body.department ?? "",
        role: body.role ?? "",
        email: body.email ?? null,
        phone: body.phone ?? null,
        notificationMethod: body.notificationMethod ?? "dashboard",
        active: body.active ?? true,
      },
      include: { company: true },
    });
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "スタッフの作成に失敗しました" },
      { status: 500 }
    );
  }
}
