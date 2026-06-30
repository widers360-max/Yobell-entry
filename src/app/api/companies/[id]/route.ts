import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const company = await prisma.company.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(company);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.staff.deleteMany({ where: { companyId: params.id } });
  await prisma.company.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
