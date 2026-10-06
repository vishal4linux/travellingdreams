import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const daySchema = z.object({
  dayNumber: z.coerce.number().int().min(1).max(60),
  title: z.string().min(2),
  description: z.string().min(2),
  meals: z.string().optional().nullable(),
  stay: z.string().optional().nullable(),
  locationName: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  hotelSlug: z.string().optional().nullable(),
  destinationSlug: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export async function POST(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId } = await ctx.params;
  const body = daySchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const day = await prisma.packageItinerary.upsert({
      where: {
        packageId_dayNumber: { packageId, dayNumber: body.data.dayNumber },
      },
      create: { packageId, ...body.data },
      update: body.data,
    });
    return NextResponse.json({ day });
  } catch {
    return NextResponse.json({ error: "Could not save day" }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: packageId } = await ctx.params;
  const body = z.array(daySchema).safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.packageItinerary.deleteMany({ where: { packageId } });
  await prisma.packageItinerary.createMany({
    data: body.data.map((d) => ({ packageId, ...d })),
  });

  const itinerary = await prisma.packageItinerary.findMany({
    where: { packageId },
    orderBy: { dayNumber: "asc" },
  });
  return NextResponse.json({ itinerary });
}
