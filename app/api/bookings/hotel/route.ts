import { getCustomerSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { createHotelBooking, hotelBookingInputSchema } from "@/services/hotel-booking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`hotel-booking:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = hotelBookingInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const session = await getCustomerSession();
    const result = await createHotelBooking({
      ...parsed.data,
      customerId: session?.customerId,
    });
    return NextResponse.json({
      bookingNumber: result.booking.bookingNumber,
      totalAmount: Number(result.booking.totalAmount),
    });
  } catch (e) {
    logger.error("hotel_booking_failed", { message: String(e) });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Booking failed" },
      { status: 400 }
    );
  }
}
