import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const field of [
      "name",
      "department",
      "title",
      "email",
      "phone",
      "active",
      "sortOrder",
    ]) {
      if (field in body) data[field] = body[field];
    }

    const staff = await prisma.staff.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ staff });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新に失敗しました。" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Soft delete to preserve visit history references.
    await prisma.staff.update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "削除に失敗しました。" },
      { status: 500 },
    );
  }
}
