import { PackageCard } from "@/components/home/PackageCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Input, Label } from "@/components/ui/input";
import { parsePackageSearchParams, searchPackages, getPackageFilterMeta } from "@/services/packages";
import { decimalToNumber } from "@/lib/serialize";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description: "Book curated holiday packages across Himachal, Spiti, Kashmir, Ladakh and more.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PackagesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parsePackageSearchParams(raw);
  const [packages, { destinations }] = await Promise.all([
    searchPackages(filters),
    getPackageFilterMeta(),
  ]);

  return (
    <div className="section-padding">
      <div className="container-site">
        <SectionHeading title="Holiday Packages" description="Filter by destination, duration, theme and budget." />
        <form className="glass mt-8 grid gap-4 rounded-[1.75rem] p-5 md:grid-cols-3 lg:grid-cols-6">
          <div className="md:col-span-2 lg:col-span-2">
            <Label htmlFor="q">Search packages</Label>
            <Input
              id="q"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Manali, Ladakh, Spiti, Amritsar, Rajasthan…"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <select
              id="destination"
              name="destination"
              defaultValue={filters.destination ?? ""}
              className="mt-1.5 flex h-11 w-full rounded-xl border border-border px-3 text-sm"
            >
              <option value="">All</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              name="theme"
              defaultValue={filters.theme ?? ""}
              className="mt-1.5 flex h-11 w-full rounded-xl border border-border px-3 text-sm"
            >
              <option value="">Any</option>
              {["ADVENTURE", "HONEYMOON", "FAMILY", "SPIRITUAL", "HERITAGE", "WEEKEND"].map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="departure">Departure city</Label>
            <Input id="departure" name="departure" defaultValue={filters.departure ?? ""} className="mt-1.5" placeholder="e.g. Delhi" />
          </div>
          <div>
            <Label htmlFor="duration">Max nights</Label>
            <Input id="duration" name="duration" type="number" defaultValue={filters.duration ?? ""} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="budget">Max budget (₹)</Label>
            <Input id="budget" name="budget" type="number" defaultValue={filters.budget ?? ""} className="mt-1.5" />
          </div>
          <div className="flex items-end md:col-span-3 lg:col-span-6">
            <button type="submit" className="h-11 w-full rounded-xl bg-brand-700 text-sm font-medium text-white md:w-auto md:px-10">
              Apply filters
            </button>
          </div>
        </form>
        {packages.length === 0 ? (
          <p className="mt-10 text-center text-ink-muted">
            No packages match your search. Try keywords like Manali, Dharamshala, Leh Ladakh, Spiti, Shimla, Kasauli,
            Rajasthan or Uttarakhand.
          </p>
        ) : null}
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((p) => {
            const dest = p.destinations[0]?.destination;
            return (
              <PackageCard
                key={p.id}
                title={p.title}
                slug={p.slug}
                destinationSlug={dest?.slug ?? "india"}
                destinationName={dest?.name ?? "India"}
                durationNights={p.durationNights}
                durationDays={p.durationDays}
                startingCity={p.startingCity}
                placesCovered={p.placesCovered}
                hotelCategory={p.hotelCategory}
                meals={p.meals}
                transport={p.transport}
                basePrice={decimalToNumber(p.basePrice) ?? 0}
                rating={p.rating}
                heroImage={p.heroImage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
