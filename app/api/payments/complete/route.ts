import { rateLimit } from "@/lib/rate-limit";
import { completeBookingPayment } from "@/services/payments";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingNumber: z.string(),
  paymentId: z.string().optional(),
  amount: z.coerce.number().optional(),
  isAdvance: z.boolean().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`pay-complete:${ip}`, 20, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.ALLOW_MOCK_PAYMENT &&
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json({ error: "Mock payment disabled" }, { status: 403 });
    }
    await completeBookingPayment(parsed.data.bookingNumber, parsed.data.paymentId, {
      amount: parsed.data.amount,
      isAdvance: parsed.data.isAdvance,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment failed" },
      { status: 400 }
    );
  }
}
