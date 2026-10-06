import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  state: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  cardImage: z.string().optional().nullable(),
  isPopular: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  try {
    const destination = await prisma.destination.update({
      where: { id },
      data: body.data,
    });
    return NextResponse.json({ destination });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const hotels = await prisma.hotel.count({ where: { destinationId: id } });
  if (hotels > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${hotels} hotel(s) still linked. Unpublish or reassign first.` },
      { status: 400 }
    );
  }

  try {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
