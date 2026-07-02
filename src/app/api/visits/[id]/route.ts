import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = new Set([
  "pending",
  "accepted",
  "please_wait",
  "declined",
  "no_response",
  "completed",
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
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
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  if (!body || typeof body !== "object" || body.status === undefined) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const status = String(body.status);
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const data: {
    status: string;
    respondedAt: Date | null;
  } = {
    status,
    respondedAt: status === "pending" ? null : new Date(),
  };

  const visit = await prisma.visit.update({
    where: { id: params.id },
    data,
    include: {
      hostStaff: { include: { company: true } },
    },
  });

  return NextResponse.json(visit);
}
