"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  apiPath: "/api/bookings/hotel" | "/api/bookings/package";
  payload: Record<string, unknown>;
  summary: { label: string; total: number; lines: string[] };
};

export function GuestCheckoutForm({ apiPath, payload, summary }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          guestName,
          guestEmail,
          guestPhone,
          specialRequests: specialRequests || undefined,
          couponCode: couponCode.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.formErrors?.[0] ?? "Booking failed";
        throw new Error(errMsg);
      }
      router.push(`/booking/pay/${data.bookingNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Guest details</h2>
        <p className="text-sm text-ink-muted">Guest checkout is supported. Log in to save bookings to your account.</p>
        <div>
          <Label htmlFor="guestName">Full name</Label>
          <Input id="guestName" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="guestEmail">Email</Label>
          <Input id="guestEmail" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="guestPhone">Phone (WhatsApp)</Label>
          <Input id="guestPhone" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="couponCode">Coupon code</Label>
          <Input id="couponCode" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="mt-1.5" placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="specialRequests">Special requests</Label>
          <textarea
            id="specialRequests"
            rows={3}
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm"
          />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Processing…" : "Continue to payment"}
        </Button>
      </div>
      <aside className="h-fit rounded-2xl border border-border bg-brand-50/50 p-6">
        <h3 className="font-display text-xl font-semibold">Booking summary</h3>
        <p className="mt-1 text-sm text-ink-muted">{summary.label}</p>
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {summary.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-6 font-display text-3xl font-semibold text-brand-800">
          {formatINR(summary.total)}
        </p>
        <p className="mt-2 text-xs text-ink-subtle">Taxes included where applicable.</p>
      </aside>
    </form>
  );
}
