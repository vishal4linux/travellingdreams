import { requireAdmin } from "@/lib/auth/rbac";
import { deleteLocalUpload } from "@/lib/admin/upload";
import { prisma } from "@/lib/prisma";
import { HotelCategory, PackageTheme } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  destinationId: z.string().optional(),
  durationNights: z.coerce.number().int().min(1).max(30).optional(),
  durationDays: z.coerce.number().int().min(1).max(31).optional(),
  startingCity: z.string().optional().nullable(),
  placesCovered: z.string().optional().nullable(),
  hotelCategory: z.nativeEnum(HotelCategory).optional(),
  meals: z.string().optional().nullable(),
  transport: z.string().optional().nullable(),
  highlights: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  inclusions: z.string().optional().nullable(),
  exclusions: z.string().optional().nullable(),
  cancellationPolicy: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).nullable().optional(),
  reviewCount: z.number().int().min(0).optional(),
  basePrice: z.coerce.number().min(0).optional(),
  theme: z.nativeEnum(PackageTheme).optional(),
  heroImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      destinations: { include: { destination: true }, orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      itinerary: { orderBy: { dayNumber: "asc" } },
    },
  });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ package: pkg });
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = patchSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { destinationId, ...rest } = body.data;

  try {
    if (destinationId) {
      await prisma.packageDestination.deleteMany({ where: { packageId: id } });
      await prisma.packageDestination.create({
        data: { packageId: id, destinationId, sortOrder: 0 },
      });
      const dest = await prisma.destination.findUnique({ where: { id: destinationId } });
      const pkgSlug = rest.slug ?? (await prisma.package.findUnique({ where: { id } }))?.slug;
      if (dest && pkgSlug) {
        rest.slug = rest.slug;
        await prisma.package.update({
          where: { id },
          data: { primarySlugPath: `${dest.slug}/${pkgSlug}` },
        });
      }
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: rest,
      include: {
        destinations: { include: { destination: true } },
        images: { orderBy: { sortOrder: "asc" } },
        itinerary: { orderBy: { dayNumber: "asc" } },
      },
    });
    return NextResponse.json({ package: pkg });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  for (const img of pkg.images) {
    await deleteLocalUpload(img.url);
  }
  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
