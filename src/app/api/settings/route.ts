import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.kioskSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.kioskSetting.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  const settings = await prisma.kioskSetting.upsert({
    where: { id: "default" },
    update: body,
    create: { id: "default", ...body },
  });

  return NextResponse.json(settings);
}
