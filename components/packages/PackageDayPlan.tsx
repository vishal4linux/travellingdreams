"use client";

import { cn } from "@/lib/utils";
import { BedDouble, ChevronDown, MapPin, Utensils } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type DayPlan = {
  dayNumber: number;
  title: string;
  description: string;
  meals?: string | null;
  stay?: string | null;
  locationName?: string | null;
  imageUrl?: string | null;
};

export function PackageDayPlan({ days }: { days: DayPlan[] }) {
  const [open, setOpen] = useState<number>(days[0]?.dayNumber ?? 1);

  return (
    <ol className="space-y-3">
      {days.map((day) => {
        const isOpen = open === day.dayNumber;
        return (
          <li key={day.dayNumber} className="glass overflow-hidden rounded-3xl">
            <button
              type="button"
              className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5"
              onClick={() => setOpen(isOpen ? -1 : day.dayNumber)}
              aria-expanded={isOpen}
            >
              <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-accent-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Day</span>
                <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-ink">{day.title}</span>
                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                  {day.locationName ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {day.locationName}
                    </span>
                  ) : null}
                  {day.meals ? (
                    <span className="inline-flex items-center gap-1">
                      <Utensils className="h-3.5 w-3.5" />
                      {day.meals}
                    </span>
                  ) : null}
                  {day.stay ? (
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {day.stay}
                    </span>
                  ) : null}
                </span>
              </span>
              <ChevronDown
                className={cn("mt-2 h-5 w-5 shrink-0 text-ink-subtle transition", isOpen && "rotate-180")}
              />
            </button>
            {isOpen ? (
              <div className="border-t border-white/50 px-4 pb-5 pt-4 sm:px-5 sm:pl-[5.5rem]">
                {day.imageUrl ? (
                  <div className="relative mb-4 aspect-[16/8] overflow-hidden rounded-2xl">
                    <Image src={day.imageUrl} alt="" fill className="object-cover" sizes="720px" />
                  </div>
                ) : null}
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {day.description}
                </p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
