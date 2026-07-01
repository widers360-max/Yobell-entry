import { NextResponse } from "next/server";

type AuthRole = "admin" | "staff";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body?.role as AuthRole;
    const password = typeof body?.password === "string" ? body.password : "";

    if (role !== "admin" && role !== "staff") {
      return NextResponse.json(
        { ok: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    const expected =
      role === "admin"
        ? process.env.ADMIN_PASSWORD
        : process.env.STAFF_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "Password not configured" },
        { status: 500 }
      );
    }

    if (password === expected) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
