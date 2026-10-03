import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  type: z.string().default("CUSTOM_TRIP"),
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  destinationText: z.string().optional(),
  destinationId: z.string().optional(),
  travelDateFrom: z.string().optional(),
  travelDateTo: z.string().optional(),
  flexibleDates: z.boolean().optional(),
  adults: z.coerce.number().optional(),
  children: z.coerce.number().optional(),
  startingCity: z.string().optional(),
  numberOfDays: z.coerce.number().optional(),
  budget: z.string().optional(),
  hotelCategory: z.string().optional(),
  transportPreference: z.string().optional(),
  tripType: z
    .enum([
      "FAMILY",
      "COUPLE",
      "HONEYMOON",
      "FRIENDS",
      "ADVENTURE",
      "SOLO",
      "CORPORATE",
      "PILGRIMAGE",
    ])
    .optional(),
  specialRequirements: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`enquiry:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const d = parsed.data;
  await prisma.enquiry.create({
    data: {
      type: d.type,
      name: d.name,
      phone: d.phone,
      email: d.email,
      destinationId: d.destinationId,
      destinationText: d.destinationText,
      travelDateFrom: d.travelDateFrom ? new Date(d.travelDateFrom) : undefined,
      travelDateTo: d.travelDateTo ? new Date(d.travelDateTo) : undefined,
      flexibleDates: d.flexibleDates ?? false,
      adults: d.adults,
      children: d.children,
      startingCity: d.startingCity,
      numberOfDays: d.numberOfDays,
      budget: d.budget,
      transportPreference: d.transportPreference,
      tripType: d.tripType,
      specialRequirements: d.specialRequirements,
      status: "NEW",
    },
  });

  return NextResponse.json({ ok: true });
}
