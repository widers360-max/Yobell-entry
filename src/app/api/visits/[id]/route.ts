import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STATUS = [
  "WAITING",
  "ACKNOWLEDGED",
  "ON_THE_WAY",
  "COMPLETED",
  "CANCELLED",
];

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const visit = await prisma.visit.findUnique({
    where: { id: params.id },
    include: { staff: { include: { company: true } } },
  });

  if (!visit) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({ visit });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { status, responseNote, staffId } = body ?? {};

    const data: Record<string, unknown> = {};

    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return NextResponse.json(
          { error: "不正なステータスです。" },
          { status: 400 },
        );
      }
      data.status = status;
      if (status === "ACKNOWLEDGED" || status === "ON_THE_WAY") {
        data.respondedAt = new Date();
      }
      if (status === "COMPLETED" || status === "CANCELLED") {
        data.completedAt = new Date();
      }
    }

    if (typeof responseNote === "string") data.responseNote = responseNote;
    if (staffId !== undefined) data.staffId = staffId || null;

    const visit = await prisma.visit.update({
      where: { id: params.id },
      data,
      include: { staff: { include: { company: true } } },
    });

    return NextResponse.json({ visit });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新に失敗しました。" },
      { status: 500 },
    );
  }
}
