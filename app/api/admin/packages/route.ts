import { requireAdmin } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { HotelCategory, PackageTheme } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  destinationId: z.string().min(1),
  durationNights: z.coerce.number().int().min(1).max(30),
  durationDays: z.coerce.number().int().min(1).max(31),
  startingCity: z.string().optional().nullable(),
  placesCovered: z.string().optional().nullable(),
  hotelCategory: z.nativeEnum(HotelCategory).optional(),
  meals: z.string().optional().nullable(),
  transport: z.string().optional().nullable(),
  highlights: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  inclusions: z.string().optional().nullable(),
  exclusions: z.string().optional().nullable(),
  basePrice: z.coerce.number().min(0),
  theme: z.nativeEnum(PackageTheme).optional(),
  heroImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const packages = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      destinations: {
        include: { destination: { select: { id: true, name: true, slug: true } } },
        take: 1,
      },
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      _count: { select: { itinerary: true } },
    },
  });
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input", details: body.error.flatten() }, { status: 400 });
  }

  const data = body.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const dest = await prisma.destination.findUnique({ where: { id: data.destinationId } });
  if (!dest) return NextResponse.json({ error: "Destination not found" }, { status: 400 });

  const existing = await prisma.package.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const pkg = await prisma.package.create({
    data: {
      title: data.title,
      slug,
      primarySlugPath: `${dest.slug}/${slug}`,
      durationNights: data.durationNights,
      durationDays: data.durationDays,
      startingCity: data.startingCity ?? undefined,
      placesCovered: data.placesCovered ?? undefined,
      hotelCategory: data.hotelCategory ?? HotelCategory.DELUXE,
      meals: data.meals ?? undefined,
      transport: data.transport ?? undefined,
      highlights: data.highlights ?? undefined,
      description: data.description ?? undefined,
      inclusions: data.inclusions ?? undefined,
      exclusions: data.exclusions ?? undefined,
      basePrice: data.basePrice,
      theme: data.theme ?? PackageTheme.ADVENTURE,
      heroImage: data.heroImage ?? undefined,
      metaTitle: data.metaTitle ?? `${data.title} | Travelling Dreams`,
      metaDescription: data.metaDescription ?? data.highlights ?? undefined,
      isPublished: data.isPublished ?? true,
      isFeatured: data.isFeatured ?? false,
      destinations: {
        create: { destinationId: data.destinationId, sortOrder: 0 },
      },
      images: data.heroImage
        ? { create: { url: data.heroImage, alt: data.title, sortOrder: 0 } }
        : undefined,
      prices: {
        create: {
          label: "Standard",
          adultPrice: data.basePrice,
          childPrice: Math.round(data.basePrice * 0.55),
        },
      },
    },
    include: {
      destinations: { include: { destination: true } },
      images: true,
    },
  });

  return NextResponse.json({ package: pkg });
}
