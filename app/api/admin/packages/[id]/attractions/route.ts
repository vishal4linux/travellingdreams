import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  name: z.string().min(2),
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

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id: packageId } = await ctx.params;
  const attractions = await prisma.packageAttraction.findMany({
    where: { packageId },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ attractions });
}

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId } = await ctx.params;
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const attraction = await prisma.packageAttraction.create({
    data: {
      packageId,
      name: body.data.name,
      dayNumber: body.data.dayNumber ?? null,
      tagline: body.data.tagline ?? null,
      description: body.data.description ?? null,
      whyVisit: body.data.whyVisit ?? null,
      category: body.data.category ?? "sightseeing",
      latitude: body.data.latitude ?? null,
      longitude: body.data.longitude ?? null,
      imageUrl: body.data.imageUrl ?? null,
      sortOrder: body.data.sortOrder ?? 0,
    },
  });
  return NextResponse.json({ attraction });
}
