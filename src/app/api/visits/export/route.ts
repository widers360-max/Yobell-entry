import { prisma } from "@/lib/prisma";
import { visitorTypeLabel, visitStatusLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export async function GET() {
  const visits = await prisma.visit.findMany({
    orderBy: { createdAt: "desc" },
    include: { staff: { include: { company: true } } },
  });

  const header = [
    "受付日時",
    "来訪者名",
    "来訪者会社",
    "来訪区分",
    "人数",
    "ご用件",
    "対応会社",
    "対応担当者",
    "ステータス",
    "応答日時",
    "完了日時",
  ];

  const rows = visits.map((v) =>
    [
      formatDate(v.createdAt),
      v.visitorName,
      v.visitorCompany,
      visitorTypeLabel(v.visitorType),
      v.partySize,
      v.purpose,
      v.staff?.company?.name ?? "",
      v.staff?.name ?? "",
      visitStatusLabel(v.status),
      formatDate(v.respondedAt),
      formatDate(v.completedAt),
    ]
      .map(csvCell)
      .join(","),
  );

  // BOM so Excel opens UTF-8 Japanese correctly.
  const csv = "\uFEFF" + [header.join(","), ...rows].join("\r\n");

  const filename = `yobell-visits-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
