import { createHmac } from "crypto";
import type { CreateOrderInput, CreateOrderResult, PaymentProvider } from "./types";

export const razorpayProvider: PaymentProvider = {
  name: "razorpay",
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay is not configured");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: input.currency ?? "INR",
        receipt: input.bookingNumber,
        notes: { bookingNumber: input.bookingNumber },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Razorpay order failed: ${text}`);
    }

    const data = (await res.json()) as { id: string; amount: number; currency: string };
    return {
      provider: "razorpay",
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    };
  },
  verifyPaymentSignature(payload) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return false;
    const body = `${payload.orderId}|${payload.paymentId}`;
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    return expected === payload.signature;
  },
};
