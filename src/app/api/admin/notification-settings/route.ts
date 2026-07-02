import { NextResponse } from "next/server";
import { getSmtpStatus } from "@/lib/email";

export async function GET() {
  try {
    return NextResponse.json(getSmtpStatus());
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load notification settings",
      },
      { status: 500 }
    );
  }
}
