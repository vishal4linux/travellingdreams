import { rateLimit } from "@/lib/rate-limit";
import { lookupBookingForGuest } from "@/services/booking-lookup";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingNumber: z.string().min(5),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`lookup:${ip}`, 10, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const booking = await lookupBookingForGuest(parsed.data.bookingNumber, parsed.data.email);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    type: booking.type,
    totalAmount: Number(booking.totalAmount),
  });
}
