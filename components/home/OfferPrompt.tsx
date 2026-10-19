"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function OfferPrompt() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="border-b border-brand-200 bg-white">
      <div className="container-site flex items-center justify-between gap-3 py-3">
        <p className="text-sm text-ink">
          <span className="font-bold">Login to unlock member rates.</span>{" "}
          <span className="text-ink-muted">Save the trip and ask us for a quote.</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/account/login"
            className="rounded-lg bg-brand-950 px-3 py-2 text-sm font-bold text-white"
          >
            Login
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-ink-muted hover:bg-brand-50"
            aria-label="Dismiss"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
