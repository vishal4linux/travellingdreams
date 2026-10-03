import { HotelFilters } from "@/components/hotels/HotelFilters";
import { HotelListingCard } from "@/components/hotels/HotelListingCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { parseHotelSearchParams } from "@/lib/hotel-search";
import { getHotelFilterMeta, searchHotels } from "@/services/hotels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels",
  description: "Search and book handpicked hotels and LA Riqueza partner stays across India.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HotelsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseHotelSearchParams(raw);
  const [{ destinations, amenities }, { hotels, hasDateFilters, dateFilterError, stayContext }] =
    await Promise.all([getHotelFilterMeta(), searchHotels(filters)]);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          title="Hotels"
          description="Filter by destination, price, star rating, amenities and real-time room availability for your stay dates."
        />

        {dateFilterError ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {dateFilterError}
          </p>
        ) : null}

        {hasDateFilters && stayContext && !dateFilterError ? (
          <p className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
            Showing properties with enough rooms for{" "}
            <strong>{stayContext.checkIn}</strong> → <strong>{stayContext.checkOut}</strong> (
            {stayContext.rooms} room(s), {stayContext.adults} adult(s)
            {stayContext.children ? `, ${stayContext.children} child(ren)` : ""}).
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          <HotelFilters filters={filters} destinations={destinations} amenities={amenities} />
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-sm text-ink-muted">
              {hotels.length} {hotels.length === 1 ? "property" : "properties"} found
            </p>
            <ul className="space-y-6">
              {hotels.map((h) => (
                <li key={h.id}>
                  <HotelListingCard
                    name={h.name}
                    slug={h.slug}
                    destinationSlug={h.destination.slug}
                    city={h.city}
                    state={h.state}
                    starRating={h.starRating}
                    propertyType={h.propertyType}
                    shortDescription={h.shortDescription}
                    imageUrl={h.images[0]?.url ?? null}
                    isLaRiqueza={h.isLaRiqueza}
                    isFeatured={h.isFeatured}
                    guestRating={h.guestRating}
                    reviewCount={h.reviewCount}
                    startingRate={h.startingRate}
                    amenityNames={h.amenityNames}
                    searchContext={filters}
                    availableForStay={hasDateFilters && !dateFilterError}
                  />
                </li>
              ))}
            </ul>
            {hotels.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface-elevated p-8 text-center text-ink-muted">
                No hotels match these filters. Try clearing amenities or widening your price range.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
