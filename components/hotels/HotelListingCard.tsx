import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hotelBookQuery, hotelDetailPath } from "@/lib/constants/hotel";
import type { HotelSearchFilters } from "@/lib/hotel-search";
import { formatINR } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

type Props = {
  name: string;
  slug: string;
  destinationSlug: string;
  city: string;
  state: string;
  starRating: number;
  propertyType: string;
  shortDescription: string | null;
  imageUrl: string | null;
  isLaRiqueza: boolean;
  isFeatured: boolean;
  guestRating: number | null;
  reviewCount: number;
  startingRate: number | null;
  amenityNames: string[];
  searchContext: HotelSearchFilters;
  availableForStay?: boolean;
};

export function HotelListingCard({
  name,
  slug,
  destinationSlug,
  city,
  state,
  starRating,
  shortDescription,
  imageUrl,
  isLaRiqueza,
  isFeatured,
  guestRating,
  reviewCount,
  startingRate,
  amenityNames,
  searchContext,
  availableForStay,
}: Props) {
  const path = hotelDetailPath(destinationSlug, slug);
  const qs = hotelBookQuery({
    checkIn: searchContext.checkIn,
    checkOut: searchContext.checkOut,
    rooms: searchContext.rooms,
    adults: searchContext.adults,
    children: searchContext.children,
  });

  const image =
    imageUrl ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col md:flex-row">
        <div className="relative aspect-[16/10] w-full md:aspect-auto md:w-72 md:min-h-[220px]">
          <Image src={image} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 288px" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {isFeatured ? <Badge className="bg-brand-700 text-white">Featured</Badge> : null}
            {isLaRiqueza ? <Badge className="bg-white/95 text-brand-900">LA Riqueza</Badge> : null}
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">{name}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {city}, {state}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">{starRating}-star hotel</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                {guestRating?.toFixed(1) ?? "—"}
              </p>
              <p className="text-xs text-ink-subtle">{reviewCount} reviews</p>
            </div>
          </div>
          {availableForStay ? (
            <p className="mt-2 text-sm font-medium text-green-800">Available for your dates</p>
          ) : null}
          {shortDescription ? (
            <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{shortDescription}</p>
          ) : null}
          {amenityNames.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {amenityNames.slice(0, 5).map((a) => (
                <li key={a}>
                  <Badge className="bg-brand-50 text-brand-800">{a}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
            <div>
              {startingRate != null ? (
                <>
                  <p className="text-xs text-ink-subtle">Starting from</p>
                  <p className="font-display text-2xl font-semibold text-brand-800">
                    {formatINR(startingRate)}
                    <span className="text-sm font-normal text-ink-subtle"> / night</span>
                  </p>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`${path}${qs}`} variant="secondary" size="sm">
                View hotel
              </ButtonLink>
              <ButtonLink
                href={`${path}${qs ? `${qs}&book=1` : "?book=1"}`}
                size="sm"
              >
                Book now
              </ButtonLink>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
