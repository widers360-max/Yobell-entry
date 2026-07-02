import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyHostStaffForVisit } from "@/lib/visit-notify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pending = searchParams.get("pending");
    const q = searchParams.get("q")?.trim();
    const visitorType = searchParams.get("visitorType");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const host = searchParams.get("host")?.trim();
    const summary = searchParams.get("summary") === "true";

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const whereClause = {
      ...(status ? { status } : {}),
      ...(pending === "true" ? { status: "pending" } : {}),
      ...(visitorType ? { visitorType } : {}),
      ...(Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}),
      ...(q || host
        ? {
            AND: [
              ...(q
                ? [
                    {
                      OR: [
                        { visitorName: { contains: q } },
                        { visitorCompany: { contains: q } },
                        { purpose: { contains: q } },
                      ],
                    },
                  ]
                : []),
              ...(host
                ? [
                    {
                      OR: [
                        { hostStaff: { name: { contains: host } } },
                        {
                          hostStaff: {
                            company: { name: { contains: host } },
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };

    const take = pending === "true" ? 50 : summary ? 200 : 500;

    if (summary) {
      const visits = await prisma.visit.findMany({
        where: whereClause,
        select: {
          id: true,
          visitorName: true,
          visitorCompany: true,
          visitorPhone: true,
          purpose: true,
          visitorType: true,
          status: true,
          createdAt: true,
          hostStaff: {
            select: {
              id: true,
              name: true,
              department: true,
              company: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take,
      });
      return NextResponse.json(visits.map((v) => ({ ...v, photoData: null })));
    }

    const visits = await prisma.visit.findMany({
      where: whereClause,
      include: {
        hostStaff: { include: { company: true } },
      },
      orderBy: { createdAt: "desc" },
      take,
    });

    return NextResponse.json(visits);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "来訪ログの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.visitorName || !body.hostStaffId || !body.visitorType) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const inputMethod =
      body.inputMethod === "quick" ||
      body.inputMethod === "manual" ||
      body.inputMethod === "business_card"
        ? body.inputMethod
        : "manual";

    const visit = await prisma.visit.create({
      data: {
        visitorName: body.visitorName,
        visitorCompany: body.visitorCompany ?? null,
        visitorPhone: body.visitorPhone ?? null,
        purpose: body.purpose ?? null,
        visitorType: body.visitorType,
        hostStaffId: body.hostStaffId,
        photoData: body.photoData ?? null,
        inputMethod,
        status: "pending",
      },
      include: {
        hostStaff: { include: { company: true } },
      },
    });

    try {
      await notifyHostStaffForVisit(visit);
    } catch (notifyError) {
      console.error("[visits POST] notification failed:", notifyError);
    }

    const updated = await prisma.visit.findUnique({
      where: { id: visit.id },
      include: {
        hostStaff: { include: { company: true } },
      },
    });

    return NextResponse.json(updated ?? visit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "来訪記録の作成に失敗しました" },
      { status: 500 }
    );
  }
}
