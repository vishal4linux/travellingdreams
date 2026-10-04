import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";

type Props = {
  name: string;
  slug: string;
  city: string;
  state: string;
  starRating: number;
  shortDescription: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  guestRating: number | null;
  startingRate: number | null;
  amenityNames: string[];
  destinationSlug: string;
  brandLabel?: string;
  openingSoon?: boolean;
};

export function HotelCard({
  name,
  slug,
  city,
  state,
  starRating,
  shortDescription,
  imageUrl,
  isFeatured,
  guestRating,
  startingRate,
  amenityNames,
  destinationSlug,
  brandLabel = "LA Riqueza Hotels",
  openingSoon = false,
}: Props) {
  const image =
    imageUrl ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80 p-0">
      <div className="relative aspect-[16/10]">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {openingSoon ? (
            <Badge className="bg-amber-600 text-white">Opening soon</Badge>
          ) : null}
          {isFeatured ? (
            <Badge className="bg-brand-700 text-white">Featured</Badge>
          ) : null}
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{brandLabel}</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">{name}</h3>
            <p className="text-sm text-ink-muted">
              {city}, {state}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-ink">
            <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
            {guestRating && guestRating > 0 ? guestRating.toFixed(1) : starRating}
          </div>
        </div>
        {shortDescription ? (
          <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{shortDescription}</p>
        ) : null}
        {amenityNames.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {amenityNames.slice(0, 4).map((a) => (
              <li key={a}>
                <Badge className="bg-brand-50 text-brand-800">{a}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            {startingRate != null && !openingSoon ? (
              <>
                <p className="text-xs text-ink-subtle">Rooms from</p>
                <p className="font-display text-2xl font-semibold text-brand-800">
                  {formatINR(startingRate)}
                </p>
              </>
            ) : openingSoon ? (
              <p className="text-sm font-medium text-amber-900">Rates at launch</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/hotels/${destinationSlug}/${slug}`} variant="secondary" size="sm">
              View Hotel
            </ButtonLink>
            {!openingSoon ? (
              <ButtonLink href={`/hotels/${destinationSlug}/${slug}?book=1`} size="sm">
                Book Now
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
