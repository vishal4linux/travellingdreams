"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PAYMENT_PENDING",
  "PAID",
  "CANCELLED",
  "COMPLETED",
  "REFUNDED",
] as const;

type Props = { bookingId: string; current: string };

export function AdminBookingStatusSelect({ bookingId, current }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  async function onChange(next: string) {
    setStatus(next);
    setLoading(true);
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-stone-200 px-2 py-1 text-xs"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
