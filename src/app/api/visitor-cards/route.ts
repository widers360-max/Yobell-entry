import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cards = await prisma.visitorCard.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "用件カードの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "配列が必要です" }, { status: 400 });
    }

    const results = await prisma.$transaction(
      body.map(
        (card: {
          id: string;
          title?: string;
          subtitle?: string;
          iconKey?: string;
          sortOrder?: number;
          active?: boolean;
        }) =>
          prisma.visitorCard.update({
            where: { id: card.id },
            data: {
              ...(card.title !== undefined ? { title: card.title } : {}),
              ...(card.subtitle !== undefined ? { subtitle: card.subtitle } : {}),
              ...(card.iconKey !== undefined ? { iconKey: card.iconKey } : {}),
              ...(card.sortOrder !== undefined ? { sortOrder: card.sortOrder } : {}),
              ...(card.active !== undefined ? { active: card.active } : {}),
            },
          })
      )
    );

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "用件カードの保存に失敗しました" },
      { status: 500 }
    );
  }
}
