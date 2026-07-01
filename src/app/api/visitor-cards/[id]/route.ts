import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const card = await prisma.visitorCard.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "用件カードの更新に失敗しました" },
      { status: 500 }
    );
  }
}
