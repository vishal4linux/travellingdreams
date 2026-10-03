import { getCustomerSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { lookupBookingForGuest } from "@/services/booking-lookup";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingNumber: z.string(),
  email: z.string().email().optional(),
  reason: z.string().min(5).max(2000),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`cancel:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const session = await getCustomerSession();
  let booking = null;

  if (session) {
    booking = await prisma.booking.findFirst({
      where: {
        bookingNumber: parsed.data.bookingNumber,
        OR: [
          { hotelBooking: { customerId: session.customerId } },
          { packageBooking: { customerId: session.customerId } },
        ],
      },
    });
  } else if (parsed.data.email) {
    booking = await lookupBookingForGuest(parsed.data.bookingNumber, parsed.data.email);
  }

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      cancellationRequestedAt: new Date(),
      cancellationReason: parsed.data.reason,
      adminNotes: `Cancellation requested: ${parsed.data.reason}`,
    },
  });

  return NextResponse.json({ ok: true });
}
