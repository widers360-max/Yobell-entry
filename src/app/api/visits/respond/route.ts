import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildRespondErrorHtml,
  buildRespondSuccessHtml,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["accepted", "please_wait", "declined"] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();
    const status = searchParams.get("status")?.trim();

    if (!id || !status || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return new NextResponse(
        buildRespondErrorHtml("無効なリクエストです"),
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    const visit = await prisma.visit.findUnique({ where: { id } });
    if (!visit) {
      return new NextResponse(buildRespondErrorHtml("来訪記録が見つかりません"), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    await prisma.visit.update({
      where: { id },
      data: {
        status,
        respondedAt: new Date(),
      },
    });

    return new NextResponse(buildRespondSuccessHtml(), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("[visits/respond]", error);
    return new NextResponse(
      buildRespondErrorHtml("処理に失敗しました"),
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
