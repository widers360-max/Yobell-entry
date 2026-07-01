import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const card = await prisma.visitorCard.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(card);
}
