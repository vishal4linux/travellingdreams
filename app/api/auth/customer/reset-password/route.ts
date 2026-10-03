import { rateLimit } from "@/lib/rate-limit";
import { resetPasswordWithToken } from "@/services/password-reset";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`reset:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }
}
