import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.kioskSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.kioskSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "設定の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const settings = await prisma.kioskSetting.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "設定の保存に失敗しました" },
      { status: 500 }
    );
  }
}
