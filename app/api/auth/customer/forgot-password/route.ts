import { rateLimit } from "@/lib/rate-limit";
import { createPasswordResetToken } from "@/services/password-reset";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`forgot:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = await createPasswordResetToken(parsed.data.email);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const resetUrl = token ? `${base}/account/reset-password?token=${token.token}` : null;

  return NextResponse.json({
    ok: true,
    message: "If an account exists, reset instructions were sent.",
    resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
  });
}
