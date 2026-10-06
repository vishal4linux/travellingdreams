"use client";

import { categoryMeta } from "@/lib/package-attractions";
import { cn } from "@/lib/utils";
import { Compass, MapPin, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type JourneyPlace = {
  id: string;
  name: string;
  tagline?: string | null;
  whyVisit?: string | null;
  description?: string | null;
  category: string;
  dayNumber?: number | null;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
};

export type JourneyDay = {
  dayNumber: number;
  title: string;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type Props = {
  places: JourneyPlace[];
  days: JourneyDay[];
  packageTitle: string;
};

function project(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  pad = 48
) {
  const x =
    pad +
    ((lng - bounds.minLng) / Math.max(bounds.maxLng - bounds.minLng, 0.001)) *
      (width - pad * 2);
  const y =
    pad +
    (1 - (lat - bounds.minLat) / Math.max(bounds.maxLat - bounds.minLat, 0.001)) *
      (height - pad * 2);
  return { x, y };
}

export function PackageJourneyMap({ places, days, packageTitle }: Props) {
  const mappable = places.filter((p) => p.latitude != null && p.longitude != null);
  const [activeId, setActiveId] = useState<string | null>(mappable[0]?.id ?? null);
  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const filtered = useMemo(() => {
    if (dayFilter === "all") return mappable;
    return mappable.filter((p) => p.dayNumber === dayFilter);
  }, [mappable, dayFilter]);

  const active = filtered.find((p) => p.id === activeId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (active && !filtered.some((p) => p.id === active.id)) {
      setActiveId(filtered[0]?.id ?? null);
    }
  }, [filtered, active]);

  const bounds = useMemo(() => {
    if (filtered.length === 0) {
      return { minLat: 28, maxLat: 34, minLng: 74, maxLng: 79 };
    }
    const lats = filtered.map((p) => p.latitude);
    const lngs = filtered.map((p) => p.longitude);
    const padLat = 0.08;
    const padLng = 0.1;
    return {
      minLat: Math.min(...lats) - padLat,
      maxLat: Math.max(...lats) + padLat,
      minLng: Math.min(...lngs) - padLng,
      maxLng: Math.max(...lngs) + padLng,
    };
  }, [filtered]);

  const W = 800;
  const H = 480;
  const points = filtered.map((p) => ({
    ...p,
    ...project(p.latitude, p.longitude, bounds, W, H),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const overnightStops = days.filter((d) => d.latitude != null && d.longitude != null);

  if (mappable.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-brand-50/50 px-6 py-16 text-center">
        <Compass className="mx-auto h-10 w-10 text-accent-600" />
        <p className="mt-3 font-semibold text-ink">Map coming soon</p>
        <p className="mt-1 text-sm text-ink-muted">
          Add latitude/longitude for attractions in the admin package studio.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-brand-950 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-300">
            Interactive journey
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-white">{packageTitle}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDayFilter("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              dayFilter === "all"
                ? "bg-accent-500 text-white"
                : "bg-white/10 text-brand-100 hover:bg-white/15"
            )}
          >
            All stops
          </button>
          {days.map((d) => (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setDayFilter(d.dayNumber)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                dayFilter === d.dayNumber
                  ? "bg-accent-500 text-white"
                  : "bg-white/10 text-brand-100 hover:bg-white/15"
              )}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[320px] bg-[radial-gradient(ellipse_at_30%_20%,#3d2a22_0%,#2f1c16_45%,#1a100c_100%)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c1936a' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Package route map">
            {pathD ? (
              <path
                d={pathD}
                fill="none"
                stroke="rgba(249,115,22,0.55)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 10"
                className={cn(mounted && "animate-map-dash")}
              />
            ) : null}
            {overnightStops.map((d) => {
              const pt = project(d.latitude!, d.longitude!, bounds, W, H);
              return (
                <g key={`night-${d.dayNumber}`}>
                  <circle cx={pt.x} cy={pt.y} r="18" fill="rgba(255,255,255,0.06)" />
                  <text
                    x={pt.x}
                    y={pt.y + 4}
                    textAnchor="middle"
                    className="fill-brand-200 text-[11px] font-semibold"
                  >
                    D{d.dayNumber}
                  </text>
                </g>
              );
            })}
            {points.map((p, i) => {
              const meta = categoryMeta(p.category);
              const isActive = active?.id === p.id;
              return (
                <g
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => setActiveId(p.id)}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "scale(1)" : "scale(0.6)",
                    transformOrigin: `${p.x}px ${p.y}px`,
                    transition: `opacity 0.4s ${i * 0.06}s, transform 0.45s ${i * 0.06}s`,
                  }}
                >
                  {isActive ? (
                    <circle cx={p.x} cy={p.y} r="22" fill={meta.color} opacity="0.25">
                      <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" />
                    </circle>
                  ) : null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 11 : 8}
                    fill={meta.color}
                    stroke="white"
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 16}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-bold"
                    style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.45)", strokeWidth: 3 }}
                  >
                    {p.name.length > 18 ? `${p.name.slice(0, 16)}…` : p.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="absolute bottom-3 left-4 text-[11px] text-brand-200/80">
            Tap a pin to discover why travellers love that place
          </p>
        </div>

        <div className="border-t border-white/10 bg-brand-900/80 p-5 lg:border-l lg:border-t-0">
          {active ? (
            <div key={active.id} className="animate-fade-up">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: categoryMeta(active.category).color }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {categoryMeta(active.category).label}
                  </span>
                  {active.dayNumber ? (
                    <p className="mt-2 text-xs font-medium text-accent-300">Day {active.dayNumber}</p>
                  ) : null}
                  <h4 className="mt-1 text-xl font-bold text-white">{active.name}</h4>
                  {active.tagline ? (
                    <p className="mt-1 text-sm text-brand-200">{active.tagline}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="rounded-lg p-1 text-brand-200 hover:bg-white/10 lg:hidden"
                  onClick={() => setActiveId(null)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {active.imageUrl ? (
                <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={active.imageUrl}
                    alt={active.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              ) : null}

              {active.whyVisit ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-300">
                    <MapPin className="h-3.5 w-3.5" /> Why visit
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-100">{active.whyVisit}</p>
                </div>
              ) : null}
              {active.description ? (
                <p className="mt-3 text-sm leading-relaxed text-brand-200">{active.description}</p>
              ) : null}

              <ul className="mt-5 max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
                        active.id === p.id
                          ? "bg-accent-600/30 text-white"
                          : "text-brand-200 hover:bg-white/5"
                      )}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: categoryMeta(p.category).color }}
                      />
                      <span className="truncate font-medium">{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-brand-200">Select a place on the map.</p>
          )}
        </div>
      </div>

    </div>
  );
}
