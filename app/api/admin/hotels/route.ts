import { requireAdmin } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  destinationId: z.string().min(1),
  brandPartner: z.string().optional(),
  isLaRiqueza: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  starRating: z.coerce.number().int().min(1).max(5).optional(),
  address: z.string().min(2),
  city: z.string().min(1),
  state: z.string().min(1),
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
  imageUrl: z.string().url().or(z.string().startsWith("/")).optional(),
});

export async function GET() {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hotels = await prisma.hotel.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      destination: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 3 },
      _count: { select: { roomTypes: true } },
    },
  });
  return NextResponse.json({ hotels });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input", details: body.error.flatten() }, { status: 400 });
  }

  const data = body.data;
  const slug = data.slug?.trim() || slugify(data.name);

  const existing = await prisma.hotel.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const hotel = await prisma.hotel.create({
    data: {
      name: data.name,
      slug,
      destinationId: data.destinationId,
      brandPartner: data.brandPartner ?? "LA Riqueza Hotels",
      isLaRiqueza: data.isLaRiqueza ?? true,
      isFeatured: data.isFeatured ?? false,
      propertyType: data.propertyType ?? PropertyType.HOTEL,
      starRating: data.starRating ?? 3,
      address: data.address,
      city: data.city,
      state: data.state,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      shortDescription: data.shortDescription ?? undefined,
      description: data.description ?? undefined,
      policies: data.policies ?? undefined,
      checkInTime: data.checkInTime ?? "14:00",
      checkOutTime: data.checkOutTime ?? "11:00",
      metaTitle: data.metaTitle ?? `${data.name} | Travelling Dreams`,
      metaDescription: data.metaDescription ?? data.shortDescription ?? undefined,
      isPublished: data.isPublished ?? true,
      isBookable: data.isBookable ?? true,
      images: data.imageUrl
        ? {
            create: {
              url: data.imageUrl,
              alt: data.name,
              isPrimary: true,
              sortOrder: 0,
            },
          }
        : undefined,
    },
    include: { images: true, destination: true },
  });

  return NextResponse.json({ hotel });
}
