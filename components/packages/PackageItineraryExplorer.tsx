"use client";

import {
  googleMapsDirectionsUrl,
  googleMapsPlaceUrl,
  openStreetMapEmbedUrl,
  type MapStop,
} from "@/lib/maps";
import { cn } from "@/lib/utils";
import { BedDouble, ExternalLink, MapPin, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ItineraryDayView = {
  dayNumber: number;
  title: string;
  description: string;
  meals?: string | null;
  stay?: string | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hotelSlug?: string | null;
  destinationSlug?: string | null;
  imageUrl?: string | null;
};

type Props = {
  days: ItineraryDayView[];
  packageTitle: string;
};

export function PackageItineraryExplorer({ days, packageTitle }: Props) {
  const [activeDay, setActiveDay] = useState(days[0]?.dayNumber ?? 1);

  const selected = days.find((d) => d.dayNumber === activeDay) ?? days[0];

  const mapStops = useMemo(() => {
    return days
      .filter(
        (d): d is ItineraryDayView & { latitude: number; longitude: number } =>
          d.latitude != null && d.longitude != null && Boolean(d.locationName)
      )
      .map(
        (d): MapStop => ({
          dayNumber: d.dayNumber,
          name: d.locationName ?? `Day ${d.dayNumber}`,
          latitude: d.latitude,
          longitude: d.longitude,
        })
      );
  }, [days]);

  const focusStop = useMemo(() => {
    if (!selected?.latitude || !selected?.longitude || !selected.locationName) {
      return mapStops[0];
    }
    return {
      dayNumber: selected.dayNumber,
      name: selected.locationName,
      latitude: selected.latitude,
      longitude: selected.longitude,
    };
  }, [selected, mapStops]);

  const embedUrl = focusStop ? openStreetMapEmbedUrl(mapStops, focusStop) : null;
  const directionsUrl = mapStops.length ? googleMapsDirectionsUrl(mapStops) : null;

  if (!selected) return null;

  const hotelHref =
    selected.hotelSlug && selected.destinationSlug
      ? `/hotels/${selected.destinationSlug}/${selected.hotelSlug}`
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          Day-by-day route
        </p>
        <ul className="space-y-2">
          {days.map((day) => {
            const isActive = day.dayNumber === activeDay;
            const hasMap = day.latitude != null && day.longitude != null;
            return (
              <li key={day.dayNumber}>
                <button
                  type="button"
                  onClick={() => setActiveDay(day.dayNumber)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-all",
                    isActive
                      ? "glass border-accent-300/70 ring-1 ring-accent-300/50"
                      : "glass hover:border-white"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        isActive ? "bg-accent-600 text-white" : "bg-stone-100 text-ink-muted"
                      )}
                    >
                      {day.dayNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{day.title}</p>
                      {day.locationName ? (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                          {day.locationName}
                          {hasMap ? (
                            <span className="text-accent-700">· on map</span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-4">
        {selected.imageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
            <Image
              src={selected.imageUrl}
              alt={`${packageTitle} — day ${selected.dayNumber}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">
              Day {selected.dayNumber}: {selected.locationName ?? selected.title}
            </p>
          </div>
        ) : null}

        {embedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-stone-100 shadow-[var(--shadow-soft)]">
            <iframe
              title={`Map for ${packageTitle}`}
              src={embedUrl}
              className="h-56 w-full border-0 sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap gap-2 border-t border-border bg-surface-elevated p-3">
              {focusStop ? (
                <a
                  href={googleMapsPlaceUrl(
                    focusStop.latitude,
                    focusStop.longitude,
                    focusStop.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-2 text-xs font-semibold text-white hover:bg-accent-700"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  Open day location
                  <ExternalLink className="h-3 w-3 opacity-80" aria-hidden />
                </a>
              ) : null}
              {directionsUrl ? (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-ink-muted hover:bg-stone-50"
                >
                  Full route in Google Maps
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]">
          <p className="text-sm leading-relaxed text-ink-muted">{selected.description}</p>
          <dl className="mt-4 flex flex-wrap gap-4 text-sm">
            {selected.meals ? (
              <div className="flex items-center gap-2 text-ink-muted">
                <Utensils className="h-4 w-4 text-accent-600" aria-hidden />
                <span>{selected.meals}</span>
              </div>
            ) : null}
            {selected.stay ? (
              <div className="flex items-center gap-2 text-ink-muted">
                <BedDouble className="h-4 w-4 text-accent-600" aria-hidden />
                {hotelHref ? (
                  <Link href={hotelHref} className="font-medium text-accent-700 hover:underline">
                    {selected.stay}
                  </Link>
                ) : (
                  <span>{selected.stay}</span>
                )}
              </div>
            ) : null}
          </dl>
          {selected.destinationSlug && !selected.hotelSlug ? (
            <Link
              href={`/destinations/${selected.destinationSlug}`}
              className="mt-4 inline-flex text-sm font-medium text-accent-700 hover:underline"
            >
              Explore {selected.locationName ?? "destination"} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
