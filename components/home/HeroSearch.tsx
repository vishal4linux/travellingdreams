"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DestinationOption = { name: string; slug: string };

type Props = {
  destinations: DestinationOption[];
};

export function HeroSearch({ destinations }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"hotels" | "packages">("hotels");

  function onHotelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const dest = fd.get("destination") as string;
    if (dest) params.set("destination", dest);
    ["checkIn", "checkOut", "rooms", "adults", "children"].forEach((key) => {
      const v = fd.get(key);
      if (v) params.set(key, String(v));
    });
    router.push(`/hotels?${params.toString()}`);
  }

  function onPackageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const dest = fd.get("destination") as string;
    if (dest) params.set("destination", dest);
    ["travelDate", "duration", "adults", "children"].forEach((key) => {
      const v = fd.get(key);
      if (v) params.set(key, String(v));
    });
    router.push(`/packages?${params.toString()}`);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div className="mt-8 w-full max-w-4xl rounded-2xl border border-white/25 bg-white p-1 shadow-2xl shadow-black/20 sm:mt-10 sm:p-1.5">
      <p className="px-4 pt-3 text-sm font-medium text-ink-muted sm:px-5">
        Tell us what you want to experience
      </p>
      <div className="mx-2 mt-2 flex gap-1 rounded-xl bg-stone-100 p-1 sm:mx-3">
        {(
          [
            ["hotels", "Hotels"],
            ["packages", "Holiday Packages"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id
                ? "bg-white text-ink shadow-sm ring-1 ring-border/80"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "hotels" ? (
        <form onSubmit={onHotelSubmit} className="grid gap-4 px-3 pb-4 pt-3 sm:grid-cols-2 sm:px-4 sm:pb-5 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <Label htmlFor="hotel-destination">Destination / Hotel</Label>
            <select
              id="hotel-destination"
              name="destination"
              className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
              defaultValue=""
            >
              <option value="">All destinations</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="checkIn">Check-in</Label>
            <Input id="checkIn" name="checkIn" type="date" defaultValue={fmt(tomorrow)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out</Label>
            <Input id="checkOut" name="checkOut" type="date" defaultValue={fmt(dayAfter)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="rooms">Rooms</Label>
            <Input id="rooms" name="rooms" type="number" min={1} max={8} defaultValue={1} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="hotel-adults">Adults</Label>
            <Input id="hotel-adults" name="adults" type="number" min={1} max={12} defaultValue={2} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="hotel-children">Children</Label>
            <Input id="hotel-children" name="children" type="number" min={0} max={8} defaultValue={0} className="mt-1.5" />
          </div>
          <div className="flex flex-col justify-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Search Hotels
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={onPackageSubmit} className="grid gap-4 px-3 pb-4 pt-3 sm:grid-cols-2 sm:px-4 sm:pb-5 lg:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="pkg-destination">Destination</Label>
            <select
              id="pkg-destination"
              name="destination"
              className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
              defaultValue=""
            >
              <option value="">Any destination</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="travelDate">Travel date</Label>
            <Input id="travelDate" name="travelDate" type="date" defaultValue={fmt(tomorrow)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="duration">Duration (nights)</Label>
            <Input id="duration" name="duration" type="number" min={2} max={21} placeholder="e.g. 6" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pkg-adults">Adults</Label>
            <Input id="pkg-adults" name="adults" type="number" min={1} max={12} defaultValue={2} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="pkg-children">Children</Label>
            <Input id="pkg-children" name="children" type="number" min={0} max={8} defaultValue={0} className="mt-1.5" />
          </div>
          <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Search Packages
            </Button>
            <Link
              href="/customize-trip"
              className="text-center text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Customize My Trip
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
