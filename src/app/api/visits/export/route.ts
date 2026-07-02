import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildVisitWhereClause, getVisitSearchParams } from "@/lib/visit-query";

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const searchParams = getVisitSearchParams(request);
  const settings = await prisma.kioskSetting.findUnique({
    where: { id: "default" },
  });
  const retentionDays = settings?.retentionDays ?? 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  const filterWhere = buildVisitWhereClause(searchParams);
  const filterDate = (filterWhere as { createdAt?: { gte?: Date; lte?: Date } }).createdAt;

  const visits = await prisma.visit.findMany({
    where: {
      ...filterWhere,
      createdAt: {
        gte: filterDate?.gte
          ? new Date(Math.max(filterDate.gte.getTime(), cutoff.getTime()))
          : cutoff,
        ...(filterDate?.lte ? { lte: filterDate.lte } : {}),
      },
    },
    include: {
      hostStaff: { include: { company: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const headers = [
    "ID",
    "来訪日時",
    "来訪者名",
    "来訪者会社",
    "電話番号",
    "用件",
    "来訪種別",
    "呼び出し方法",
    "通知送信",
    "通知エラー",
    "担当者",
    "担当者会社",
    "ステータス",
    "応答日時",
  ];

  const rows = visits.map((v) =>
    [
      v.id,
      v.createdAt.toISOString(),
      v.visitorName,
      v.visitorCompany,
      v.visitorPhone,
      v.purpose,
      v.visitorType,
      v.inputMethod,
      v.notificationSent ? "true" : "false",
      v.notificationError ?? "",
      v.hostStaff.name,
      v.hostStaff.company.name,
      v.status,
      v.respondedAt?.toISOString() ?? "",
    ]
      .map(escapeCsv)
      .join(","),
  );

  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const filename = `yobell-visits-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
