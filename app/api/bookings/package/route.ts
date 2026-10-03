import { getCustomerSession } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { createPackageBooking, packageBookingInputSchema } from "@/services/package-booking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit(`package-booking:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = packageBookingInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid booking details" },
        { status: 400 }
      );
    }
    const session = await getCustomerSession();
    const result = await createPackageBooking({
      ...parsed.data,
      customerId: session?.customerId,
    });
    return NextResponse.json({
      bookingNumber: result.booking.bookingNumber,
      totalAmount: Number(result.booking.totalAmount),
    });
  } catch (e) {
    logger.error("package_booking_failed", { message: String(e) });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Booking failed" },
      { status: 400 }
    );
  }
}
