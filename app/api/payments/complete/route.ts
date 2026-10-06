import { rateLimit } from "@/lib/rate-limit";
import { completeBookingPayment } from "@/services/payments";
import { razorpayProvider } from "@/services/payments/razorpay-provider";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingNumber: z.string(),
  paymentId: z.string().optional(),
  orderId: z.string().optional(),
  signature: z.string().optional(),
  amount: z.coerce.number().optional(),
  isAdvance: z.boolean().optional(),
  mock: z.boolean().optional(),
});

function mockPaymentsAllowed() {
  return (
    process.env.NODE_ENV !== "production" &&
    (process.env.ALLOW_MOCK_PAYMENT === "1" || !process.env.RAZORPAY_KEY_SECRET)
  );
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`pay-complete:${ip}`, 20, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { bookingNumber, paymentId, orderId, signature, amount, isAdvance, mock } =
    parsed.data;

  try {
    const isMockAttempt =
      mock === true ||
      (typeof paymentId === "string" && paymentId.startsWith("mock_"));

    if (isMockAttempt) {
      if (!mockPaymentsAllowed()) {
        return NextResponse.json(
          { error: "Mock payment is disabled in production" },
          { status: 403 }
        );
      }
    } else {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
          { error: "Payment gateway is not configured" },
          { status: 503 }
        );
      }
      if (!orderId || !paymentId || !signature) {
        return NextResponse.json(
          { error: "Payment signature required" },
          { status: 400 }
        );
      }
      const ok = razorpayProvider.verifyPaymentSignature({
        orderId,
        paymentId,
        signature,
      });
      if (!ok) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      const pending = await prisma.payment.findFirst({
        where: {
          providerOrderId: orderId,
          booking: { bookingNumber },
        },
      });
      if (!pending) {
        return NextResponse.json({ error: "Payment order not found" }, { status: 400 });
      }
    }

    await completeBookingPayment(bookingNumber, paymentId, {
      amount,
      isAdvance,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment failed" },
      { status: 400 }
    );
  }
}
