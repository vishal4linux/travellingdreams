"use client";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  bookingNumber: string;
  total: number;
  paid: number;
  remaining: number;
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  showMock?: boolean;
};

export function PayBookingClient({
  bookingNumber,
  total,
  paid,
  remaining,
  guestEmail,
  guestPhone,
  guestName,
  showMock = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceAmount = Math.max(1, Math.round(total * 0.3));

  async function completePay(
    amount: number,
    isAdvance: boolean,
    opts?: { paymentId?: string; orderId?: string; signature?: string; mock?: boolean }
  ) {
    const res = await fetch("/api/payments/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingNumber,
        paymentId: opts?.paymentId ?? `mock_${Date.now()}`,
        orderId: opts?.orderId,
        signature: opts?.signature,
        amount,
        isAdvance,
        mock: opts?.mock ?? true,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Payment failed");
    if (amount >= remaining - 0.01) {
      router.push(`/booking/confirmation/${bookingNumber}`);
    } else {
      router.refresh();
    }
  }

  async function payMock(full = true) {
    setLoading(true);
    setError(null);
    try {
      const amount = full ? remaining : Math.min(advanceAmount, remaining);
      await completePay(amount, !full, { mock: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function payRazorpay(amount: number, isAdvance: boolean) {
    setLoading(true);
    setError(null);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingNumber, amount }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error ?? "Could not start payment");

      if (order.provider === "mock" || !order.keyId) {
        await completePay(amount, isAdvance, { mock: true });
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay script failed"));
        document.body.appendChild(script);
      });

      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Travelling Dreams",
        description: `Booking ${bookingNumber}`,
        order_id: order.orderId,
        prefill: { name: guestName, email: guestEmail, contact: guestPhone },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          await completePay(amount, isAdvance, {
            mock: false,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6">
      <p className="text-sm text-ink-muted">Booking ID</p>
      <p className="font-mono text-lg font-semibold">{bookingNumber}</p>
      <p className="mt-4 font-display text-3xl font-semibold text-brand-800">
        {formatINR(remaining)}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Total {formatINR(total)} · Paid {formatINR(paid)}
      </p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <Button
        type="button"
        className="mt-6 w-full"
        size="lg"
        disabled={loading || remaining <= 0}
        onClick={() => payRazorpay(remaining, false)}
      >
        {loading ? "Please wait…" : `Pay full ${formatINR(remaining)}`}
      </Button>
      {remaining > advanceAmount ? (
        <Button
          type="button"
          variant="secondary"
          className="mt-2 w-full"
          disabled={loading}
          onClick={() => payRazorpay(advanceAmount, true)}
        >
          Pay 30% advance ({formatINR(Math.min(advanceAmount, remaining))})
        </Button>
      ) : null}
      {showMock ? (
        <Button type="button" variant="ghost" className="mt-2 w-full" disabled={loading} onClick={() => payMock(true)}>
          Mock full payment
        </Button>
      ) : null}
    </div>
  );
}
