import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const KEYS = [
  "homepage_hero_title",
  "homepage_hero_subtitle",
  "homepage_partner_tagline",
  "contact_phone",
  "contact_email",
  "whatsapp_number",
  "footer_blurb",
] as const;

export async function GET() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...KEYS] } },
  });
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ settings, keys: KEYS });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = z.record(z.string(), z.string()).safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const allowed = new Set<string>(KEYS);
  for (const [key, value] of Object.entries(body.data)) {
    if (!allowed.has(key)) continue;
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...KEYS] } },
  });
  return NextResponse.json({
    settings: Object.fromEntries(rows.map((r) => [r.key, r.value])),
  });
}
