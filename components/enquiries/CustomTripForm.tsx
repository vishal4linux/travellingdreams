"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TRIP_TYPES = [
  "FAMILY",
  "COUPLE",
  "HONEYMOON",
  "FRIENDS",
  "ADVENTURE",
  "SOLO",
  "CORPORATE",
  "PILGRIMAGE",
] as const;

type Props = { destinations: { slug: string; name: string }[] };

export function CustomTripForm({ destinations }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const destSlug = String(fd.get("destinationSlug") ?? "");
    const dest = destinations.find((d) => d.slug === destSlug);

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "CUSTOM_TRIP",
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email"),
        destinationText: dest?.name ?? fd.get("destinationText"),
        travelDateFrom: fd.get("travelDateFrom") || undefined,
        travelDateTo: fd.get("travelDateTo") || undefined,
        flexibleDates: fd.get("flexibleDates") === "on",
        adults: fd.get("adults"),
        children: fd.get("children"),
        startingCity: fd.get("startingCity"),
        numberOfDays: fd.get("numberOfDays"),
        budget: fd.get("budget"),
        transportPreference: fd.get("transportPreference"),
        tripType: fd.get("tripType") || undefined,
        specialRequirements: fd.get("specialRequirements"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not submit enquiry");
      return;
    }
    router.push("/contact?submitted=1");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="destinationSlug">Destination</Label>
        <select id="destinationSlug" name="destinationSlug" className="mt-1.5 flex h-11 w-full rounded-xl border border-border px-3 text-sm">
          <option value="">Select or type below</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="destinationText">Other destination</Label>
        <Input id="destinationText" name="destinationText" className="mt-1.5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="travelDateFrom">From</Label>
          <Input id="travelDateFrom" name="travelDateFrom" type="date" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="travelDateTo">To</Label>
          <Input id="travelDateTo" name="travelDateTo" type="date" className="mt-1.5" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="flexibleDates" /> Flexible dates
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="adults">Adults</Label>
          <Input id="adults" name="adults" type="number" min={1} defaultValue={2} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="children">Children</Label>
          <Input id="children" name="children" type="number" min={0} defaultValue={0} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="numberOfDays">Days</Label>
          <Input id="numberOfDays" name="numberOfDays" type="number" min={1} className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="startingCity">Starting city</Label>
        <Input id="startingCity" name="startingCity" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="budget">Budget</Label>
        <Input id="budget" name="budget" placeholder="e.g. ₹50,000 per person" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="tripType">Trip type</Label>
        <select id="tripType" name="tripType" className="mt-1.5 flex h-11 w-full rounded-xl border border-border px-3 text-sm">
          <option value="">Select</option>
          {TRIP_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="transportPreference">Transport preference</Label>
        <Input id="transportPreference" name="transportPreference" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="specialRequirements">Special requirements</Label>
        <textarea id="specialRequirements" name="specialRequirements" rows={4} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm" />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
