import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const staff = await prisma.staff.update({
    where: { id: params.id },
    data: body,
    include: { company: true },
  });
  return NextResponse.json(staff);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.staff.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
