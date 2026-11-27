import { NextResponse } from "next/server";
import { rateLimit, tooMany } from "@/lib/rateLimit";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, checkPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await rateLimit(req, "admin-login", 10, 15 * 60))) {
    return tooMany("Too many login attempts. Try again in 15 minutes.");
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 500)); // slow down guessing
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
