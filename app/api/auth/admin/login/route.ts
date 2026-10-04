import { setAdminSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`admin-login:${ip}`, 10, 60_000).ok) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      include: { role: true },
    });
  } catch (err) {
    console.error("admin login db error", err);
    return NextResponse.json(
      {
        error:
          "Database is not ready. On the server run: npx prisma db push && npm run db:ensure-admin",
      },
      { status: 503 }
    );
  }

  if (!user?.isActive || !user.role) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await setAdminSession(user.id, user.email, user.role.name);
  return NextResponse.json({ ok: true, role: user.role.name });
}
