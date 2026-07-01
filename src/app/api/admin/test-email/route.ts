import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = typeof body?.to === "string" ? body.to.trim() : "";

    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid recipient email" },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(to);

    if (result.sent) {
      return NextResponse.json({
        ok: true,
        sent: true,
        fallback: false,
        message: "Test email sent successfully",
      });
    }

    if (result.fallback) {
      return NextResponse.json({
        ok: true,
        sent: false,
        fallback: true,
        message: "SMTP not configured. Test email payload logged to console.",
        error: result.error ?? "SMTP not configured",
      });
    }

    return NextResponse.json(
      {
        ok: false,
        sent: false,
        fallback: false,
        error: result.error ?? "Failed to send test email",
      },
      { status: 500 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
