"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateCouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("10");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType: "PERCENT",
        discountValue: Number(discountValue),
        maxUses: 500,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    setCode("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-3">
      <div>
        <Label htmlFor="couponCode">Code</Label>
        <Input id="couponCode" required value={code} onChange={(e) => setCode(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="couponPct">Discount %</Label>
        <Input
          id="couponPct"
          type="number"
          required
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Create coupon
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600 md:col-span-3">{String(error)}</p> : null}
    </form>
  );
}
