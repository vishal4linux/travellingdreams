"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["NEW", "IN_PROGRESS", "CLOSED"] as const;

type Props = { enquiryId: string; current: string };

export function AdminEnquiryStatusSelect({ enquiryId, current }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  async function onChange(next: string) {
    setStatus(next);
    setLoading(true);
    try {
      await fetch(`/api/admin/enquiries/${enquiryId}`, {
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
      className="rounded border border-stone-200 px-2 py-1 text-xs uppercase"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
