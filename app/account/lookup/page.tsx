"use client";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function BookingLookupPage() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    bookingNumber: string;
    status: string;
    type: string;
    totalAmount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingNumber: bookingNumber.trim(), email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Not found");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-md">
        <h1 className="font-display text-3xl font-semibold">Find my booking</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Enter your booking reference and the email used at checkout. No login required.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="bookingNumber">Booking reference</Label>
            <Input
              id="bookingNumber"
              required
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              className="mt-1.5 font-mono"
              placeholder="PKG-… or HTL-…"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Searching…" : "Look up booking"}
          </Button>
        </form>
        {result ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-5">
            <p className="font-mono font-medium">{result.bookingNumber}</p>
            <p className="mt-2 text-sm text-ink-muted">
              {result.type} · {result.status}
            </p>
            <p className="mt-2 font-display text-2xl text-brand-800">
              {formatINR(result.totalAmount)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(result.status === "PAYMENT_PENDING" || result.status === "PENDING") && (
                <ButtonLink href={`/booking/pay/${result.bookingNumber}`} size="sm">
                  Pay now
                </ButtonLink>
              )}
              {(result.status === "PAID" || result.status === "CONFIRMED") && (
                <>
                  <ButtonLink href={`/booking/confirmation/${result.bookingNumber}`} size="sm">
                    Confirmation
                  </ButtonLink>
                  <ButtonLink href={`/booking/voucher/${result.bookingNumber}`} variant="secondary" size="sm">
                    Voucher
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        ) : null}
        <p className="mt-8 text-sm text-ink-muted">
          <Link href="/account/login" className="text-brand-700 hover:underline">
            Sign in
          </Link>{" "}
          to see all bookings linked to your account.
        </p>
      </div>
    </div>
  );

}
