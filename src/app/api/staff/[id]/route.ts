import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: body,
      include: { company: true },
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "スタッフの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.staff.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "スタッフの削除に失敗しました" },
      { status: 500 }
    );
  }
}
