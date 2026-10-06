import { completeBookingPayment } from "@/services/payments";
import { prisma } from "@/lib/prisma";
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  if (!signature || !verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const body = JSON.parse(rawBody) as {
    event?: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string; amount?: number } } };
  };

  const paymentEntity = body.payload?.payment?.entity;
  if (!paymentEntity?.order_id || body.event !== "payment.captured") {
    return NextResponse.json({ ok: true });
  }

  const payment = await prisma.payment.findFirst({
    where: { providerOrderId: paymentEntity.order_id },
    include: { booking: true },
  });
  if (!payment?.booking) {
    return NextResponse.json({ ok: true });
  }

  const amountInr = (paymentEntity.amount ?? 0) / 100;
  await completeBookingPayment(
    payment.booking.bookingNumber,
    paymentEntity.id,
    { amount: amountInr }
  );

  return NextResponse.json({ ok: true });
}
