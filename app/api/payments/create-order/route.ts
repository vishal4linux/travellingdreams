import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { getBookingPaymentBalance, getPaymentProvider } from "@/services/payments";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingNumber: z.string().min(5),
  amount: z.coerce.number().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`pay:${ip}`, 20, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const balance = await getBookingPaymentBalance(body.data.bookingNumber);
  if (!balance) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const { booking, remaining } = balance;
  const charge = body.data.amount ?? remaining;
  if (charge <= 0 || charge > remaining + 0.01) {
    return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
  }

  const guestEmail =
    booking.hotelBooking?.guestEmail ?? booking.packageBooking?.guestEmail ?? "";
  const guestPhone =
    booking.hotelBooking?.guestPhone ?? booking.packageBooking?.guestPhone ?? "";

  const provider = getPaymentProvider();
  const order = await provider.createOrder({
    bookingNumber: booking.bookingNumber,
    amountPaise: Math.round(charge * 100),
    customerEmail: guestEmail,
    customerPhone: guestPhone,
  });

  await prisma.payment.updateMany({
    where: { bookingId: booking.id, status: "PENDING" },
    data: { providerOrderId: order.orderId, provider: provider.name },
  });

  return NextResponse.json(order);
}
