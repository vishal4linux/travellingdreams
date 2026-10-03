"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { MEAL_PLAN_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/constants/hotel";
import type { HotelSearchFilters } from "@/lib/hotel-search";
import { filtersToSearchParams } from "@/lib/hotel-search";
import type { MealPlan, PropertyType } from "@prisma/client";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = { slug: string; name: string };
type Amenity = { id: string; name: string };

type Props = {
  filters: HotelSearchFilters;
  destinations: Destination[];
  amenities: Amenity[];
  className?: string;
};

function FilterFields({
  filters,
  destinations,
  amenities,
  selectedAmenities,
  onAmenityToggle,
}: Props & {
  selectedAmenities: string[];
  onAmenityToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="hf-q">Search</Label>
        <Input id="hf-q" name="q" defaultValue={filters.q ?? ""} placeholder="Hotel or city" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="hf-destination">Destination</Label>
        <select
          id="hf-destination"
          name="destination"
          defaultValue={filters.destination ?? ""}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="hf-checkIn">Check-in</Label>
          <Input id="hf-checkIn" name="checkIn" type="date" defaultValue={filters.checkIn ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="hf-checkOut">Check-out</Label>
          <Input id="hf-checkOut" name="checkOut" type="date" defaultValue={filters.checkOut ?? ""} className="mt-1.5" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="hf-rooms">Rooms</Label>
          <Input id="hf-rooms" name="rooms" type="number" min={1} max={8} defaultValue={filters.rooms ?? 1} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="hf-adults">Adults</Label>
          <Input id="hf-adults" name="adults" type="number" min={1} max={12} defaultValue={filters.adults ?? 2} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="hf-children">Children</Label>
          <Input id="hf-children" name="children" type="number" min={0} max={8} defaultValue={filters.children ?? 0} className="mt-1.5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="hf-minPrice">Min price (₹)</Label>
          <Input id="hf-minPrice" name="minPrice" type="number" min={0} defaultValue={filters.minPrice ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="hf-maxPrice">Max price (₹)</Label>
          <Input id="hf-maxPrice" name="maxPrice" type="number" min={0} defaultValue={filters.maxPrice ?? ""} className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="hf-stars">Minimum star rating</Label>
        <select
          id="hf-stars"
          name="stars"
          defaultValue={filters.stars?.toString() ?? ""}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="">Any</option>
          {[3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ stars
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="hf-minRating">Minimum guest rating</Label>
        <select
          id="hf-minRating"
          name="minRating"
          defaultValue={filters.minRating?.toString() ?? ""}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="">Any</option>
          {[4, 4.5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="hf-propertyType">Property type</Label>
        <select
          id="hf-propertyType"
          name="propertyType"
          defaultValue={filters.propertyType ?? ""}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="">Any</option>
          {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((k) => (
            <option key={k} value={k}>
              {PROPERTY_TYPE_LABELS[k]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="hf-mealPlan">Meal plan</Label>
        <select
          id="hf-mealPlan"
          name="mealPlan"
          defaultValue={filters.mealPlan ?? ""}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="">Any</option>
          {(Object.keys(MEAL_PLAN_LABELS) as MealPlan[]).map((k) => (
            <option key={k} value={k}>
              {MEAL_PLAN_LABELS[k]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="hf-sort">Sort by</Label>
        <select
          id="hf-sort"
          name="sort"
          defaultValue={filters.sort ?? "featured"}
          className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Guest rating</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="laRiqueza"
          value="1"
          defaultChecked={filters.laRiqueza === "1"}
          className="h-4 w-4 rounded border-border"
        />
        LA Riqueza Hotels only
      </label>
      {amenities.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium text-ink">Amenities</legend>
          <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
            {amenities.map((a) => (
              <li key={a.id}>
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a.id)}
                    onChange={() => onAmenityToggle(a.id)}
                  />
                  {a.name}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}
    </div>
  );
}

export function HotelFilters(props: Props) {
  const router = useRouter();
  const initial = amenityIdsFromProps(props.filters.amenities);
  const [selectedAmenities, setSelectedAmenities] = useState(initial);
  const [mobileOpen, setMobileOpen] = useState(false);

  function amenityIdsFromProps(amenities?: string) {
    if (!amenities) return [];
    return amenities.split(",").filter(Boolean);
  }

  function onAmenityToggle(id: string) {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function submit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const next: HotelSearchFilters = {};
    fd.forEach((value, key) => {
      if (key === "laRiqueza") {
        if (fd.get("laRiqueza") === "1") next.laRiqueza = "1";
        return;
      }
      const s = String(value).trim();
      if (s) (next as Record<string, string>)[key] = s;
    });
    if (selectedAmenities.length) {
      next.amenities = selectedAmenities.join(",");
    }
    router.push(`/hotels?${filtersToSearchParams(next)}`);
    setMobileOpen(false);
  }

  const formInner = (
    <FilterFields
      {...props}
      selectedAmenities={selectedAmenities}
      onAmenityToggle={onAmenityToggle}
    />
  );

  return (
    <>
      <aside className={`hidden w-full shrink-0 lg:block lg:w-72 ${props.className ?? ""}`}>
        <form
          className="sticky top-24 rounded-2xl border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]"
          onSubmit={(e) => {
            e.preventDefault();
            submit(e.currentTarget);
          }}
        >
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          <div className="mt-4">{formInner}</div>
          <Button type="submit" className="mt-6 w-full">
            Apply filters
          </Button>
        </form>
      </aside>

      <div className="lg:hidden">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters & dates
        </Button>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 flex flex-col bg-surface">
            <form
              className="flex flex-1 flex-col overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                submit(e.currentTarget);
              }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-semibold">Hotel filters</h2>
                <button type="button" className="text-sm text-brand-700" onClick={() => setMobileOpen(false)}>
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{formInner}</div>
              <div className="border-t border-border p-4">
                <Button type="submit" className="w-full">
                  Show results
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}
