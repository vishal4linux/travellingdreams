import { HotelCard } from "@/components/home/HotelCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SITE } from "@/lib/constants/site";
import { decimalToNumber } from "@/lib/serialize";
import { getLaRiquezaHotels } from "@/services/homepage";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LA Riqueza Hotels",
  description:
    "Book LA Riqueza Hotels in Kanatal, Dhanolti, McLeod Ganj and Kufri with Travelling Dreams—best-rate direct booking support.",
};

export default async function LaRiquezaHotelsPage() {
  const hotels = await getLaRiquezaHotels(16);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          eyebrow="Hospitality partner"
          title="LA Riqueza Hotels"
          description="Book directly and save—LA Riqueza in Uttarakhand and Himachal, plus London Castle Kanatal opening soon. Horizon by Shanti Delhi is listed under partner hotels."
        />
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
          {SITE.partner} is headquartered in New Delhi with over 20 years of hospitality experience.
          Properties listed below match the official portfolio at{" "}
          <Link href={SITE.partnerWebsite} className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">
            lariquezahotels.com
          </Link>
          . Contact {SITE.partnerEmail} or {SITE.partnerPhones[0]} for group bookings (save up to 40% on select dates).
        </p>
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
              brandLabel={h.brandLabel}
              openingSoon={h.openingSoon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
