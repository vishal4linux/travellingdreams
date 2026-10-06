import { requireAdmin } from "@/lib/auth/rbac";
import { deleteLocalUpload } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  destinationId: z.string().optional(),
  brandPartner: z.string().optional().nullable(),
  isLaRiqueza: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  starRating: z.coerce.number().int().min(1).max(5).optional(),
  address: z.string().min(2).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  policies: z.string().optional().nullable(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isBookable: z.boolean().optional(),
});

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      destination: true,
      images: { orderBy: { sortOrder: "asc" } },
      roomTypes: { orderBy: { name: "asc" } },
    },
  });
  if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ hotel });
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: body.data,
      include: { images: { orderBy: { sortOrder: "asc" } }, destination: true },
    });
    return NextResponse.json({ hotel });
  } catch {
    return NextResponse.json({ error: "Update failed (slug may be taken)" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });

  for (const img of hotel.images) {
    await deleteLocalUpload(img.url);
  }
  await prisma.hotel.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
