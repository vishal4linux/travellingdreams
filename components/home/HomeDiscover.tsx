"use client";

import { cn } from "@/lib/utils";
import {
  BedDouble,
  Compass,
  Heart,
  Mountain,
  Palmtree,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = { name: string; slug: string };

const pills = [
  { href: "/hotels", label: "Hotels", icon: BedDouble },
  { href: "/packages", label: "Packages", icon: Compass },
  { href: "/destinations", label: "Places", icon: Mountain },
  { href: "/offers", label: "Offers", icon: Sparkles },
  { href: "/customize-trip", label: "Custom trip", icon: Heart },
  { href: "/la-riqueza-hotels", label: "LA Riqueza", icon: Sun },
];

const moods = [
  { label: "Trending", href: "/packages", icon: Sparkles },
  { label: "Mountains", href: "/packages?q=himachal", icon: Mountain },
  { label: "Heritage", href: "/packages?q=rajasthan", icon: Compass },
  { label: "Honeymoon", href: "/packages?q=honeymoon", icon: Heart },
  { label: "Family", href: "/packages?q=family", icon: Users },
  { label: "Weekend", href: "/packages?q=delhi", icon: Sun },
  { label: "Relax", href: "/packages?q=relaxing", icon: Palmtree },
];

export function HomeDiscover({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"hotels" | "packages">("hotels");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const dest = String(fd.get("destination") ?? "");
    if (dest) params.set("destination", dest);
    if (mode === "hotels") {
      params.set("checkIn", String(fd.get("start") ?? ""));
      params.set("checkOut", String(fd.get("end") ?? ""));
      router.push(`/hotels?${params.toString()}`);
    } else {
      params.set("travelDate", String(fd.get("start") ?? ""));
      router.push(`/packages?${params.toString()}`);
    }
  }

  return (
    <section className="bg-[#f6c445] text-brand-950">
      <div className="container-site flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {pills.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-bold text-brand-950 shadow-sm hover:bg-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
        <p className="hidden shrink-0 text-sm font-bold lg:block">Stay longer, plan better.</p>
      </div>

      <div className="container-site pb-5">
        <form
          onSubmit={onSubmit}
          className="grid gap-2 rounded-2xl bg-white/70 p-2 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:items-center"
        >
          <div className="flex rounded-xl bg-white p-1">
            {(
              [
                ["hotels", "Hotels"],
                ["packages", "Packages"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-bold",
                  mode === id ? "bg-brand-950 text-white" : "text-brand-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="home-destination">
            Destination
          </label>
          <select
            id="home-destination"
            name="destination"
            className="h-12 w-full rounded-xl border-0 bg-white px-3 text-sm font-medium text-brand-950"
            defaultValue=""
          >
            <option value="">{mode === "hotels" ? "Select a hotel destination" : "Select a package destination"}</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            name="start"
            type="date"
            aria-label={mode === "hotels" ? "Check-in" : "Travel date"}
            defaultValue={fmt(tomorrow)}
            className="h-12 rounded-xl border-0 bg-white px-3 text-sm font-medium"
          />
          {mode === "hotels" ? (
            <input
              name="end"
              type="date"
              aria-label="Check-out"
              defaultValue={fmt(dayAfter)}
              className="h-12 rounded-xl border-0 bg-white px-3 text-sm font-medium"
            />
          ) : (
            <span className="hidden sm:block" />
          )}
          <button
            type="submit"
            className="h-12 rounded-xl bg-brand-950 px-6 text-sm font-bold text-white hover:bg-brand-800"
          >
            Book now
          </button>
        </form>
      </div>

      <div className="border-t border-brand-950/10 bg-[#f3f1ec]">
        <div className="container-site scrollbar-hide flex gap-1 overflow-x-auto py-3">
          {moods.map(({ label, href, icon: Icon }, index) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex min-w-[5.5rem] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 hover:bg-white",
                index === 0 && "border-b-2 border-brand-950"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
