"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { bookingNumber: string; email?: string };

export function CancelBookingButton({ bookingNumber, email }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/bookings/cancel-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingNumber, email, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessage("Cancellation request submitted. Our team will contact you.");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Request cancellation
      </Button>
    );
  }

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-border p-3">
      <textarea
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for cancellation"
        className="w-full rounded-lg border border-border px-2 py-1 text-sm"
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={loading || reason.length < 5} onClick={submit}>
          Submit
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      {message ? <p className="text-xs text-ink-muted">{message}</p> : null}
    </div>
  );
}
