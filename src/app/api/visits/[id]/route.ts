import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const visit = await prisma.visit.findUnique({
    where: { id: params.id },
    include: {
      hostStaff: { include: { company: true } },
    },
  });

  if (!visit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(visit);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const visit = await prisma.visit.update({
    where: { id: params.id },
    data: {
      ...body,
      ...(body.status && body.status !== "pending"
        ? { respondedAt: new Date() }
        : {}),
    },
    include: {
      hostStaff: { include: { company: true } },
    },
  });

  return NextResponse.json(visit);
}
