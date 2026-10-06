import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string; attractionId: string }> };

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  dayNumber: z.coerce.number().int().min(1).max(60).optional().nullable(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  whyVisit: z.string().optional().nullable(),
  category: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, attractionId } = await ctx.params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const existing = await prisma.packageAttraction.findFirst({
    where: { id: attractionId, packageId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const attraction = await prisma.packageAttraction.update({
    where: { id: attractionId },
    data: body.data,
  });
  return NextResponse.json({ attraction });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId, attractionId } = await ctx.params;
  const existing = await prisma.packageAttraction.findFirst({
    where: { id: attractionId, packageId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.packageAttraction.delete({ where: { id: attractionId } });
  return NextResponse.json({ ok: true });
}
