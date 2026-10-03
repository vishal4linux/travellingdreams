import { HotelCard } from "@/components/home/HotelCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { decimalToNumber } from "@/lib/serialize";
import { getLaRiquezaHotels } from "@/services/homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LA Riqueza Hotels",
  description: "Book LA Riqueza Hotels partner properties with Travelling Dreams.",
};

export default async function LaRiquezaHotelsPage() {
  const hotels = await getLaRiquezaHotels(12);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          eyebrow="Hospitality partner"
          title="LA Riqueza Hotels"
          description="Premium stays in Uttarakhand and Himachal Pradesh with direct booking support from our team."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {hotels.map((h) => (
            <HotelCard
              key={h.id}
              name={h.name}
              slug={h.slug}
              city={h.city}
              state={h.state}
              starRating={h.starRating}
              shortDescription={h.shortDescription}
              imageUrl={h.images[0]?.url ?? null}
              isFeatured={h.isFeatured}
              guestRating={h.guestRating}
              startingRate={decimalToNumber(h.startingRate)}
              amenityNames={h.amenityNames}
              destinationSlug={h.destination.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
