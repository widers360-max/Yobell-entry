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
    include: { _count: { select: { staff: true } } },
  });
  return NextResponse.json(company);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const staffCount = await prisma.staff.count({
    where: { companyId: params.id },
  });

  if (staffCount > 0) {
    return NextResponse.json(
      {
        error: `スタッフが${staffCount}名登録されているため削除できません`,
      },
      { status: 400 }
    );
  }

  await prisma.company.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
