"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({
  url,
  redirectTo,
  label = "Delete",
  confirmMessage = "Delete permanently?",
  className,
}: {
  url: string;
  redirectTo?: string;
  label?: string;
  confirmMessage?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      className={
        className ??
        "rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      }
      onClick={async () => {
        if (!confirm(confirmMessage)) return;
        setBusy(true);
        const res = await fetch(url, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error ?? "Delete failed");
          return;
        }
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}
