import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";

type Props = {
  title: string;
  slug: string;
  destinationSlug: string;
  destinationName: string;
  durationNights: number;
  durationDays: number;
  startingCity: string | null;
  placesCovered: string | null;
  hotelCategory: string;
  meals: string | null;
  transport: string | null;
  basePrice: number;
  rating: number | null;
  heroImage: string | null;
};

export function PackageCard(props: Props) {
  const image =
    props.heroImage ??
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop";
  const path = `/packages/${props.destinationSlug}/${props.slug}`;

  return (
    <Card className="group flex h-full min-w-[300px] flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 sm:min-w-0">
      <div className="relative aspect-[16/10]">
        <Image
          src={image}
          alt={props.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug text-ink">{props.title}</h3>
          {props.rating != null ? (
            <span className="flex shrink-0 items-center gap-0.5 text-sm font-medium">
              <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
              {props.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5" />
          {props.destinationName}
        </p>
        <p className="mt-2 text-sm font-medium text-brand-700">
          {props.durationNights} Nights / {props.durationDays} Days
        </p>
        {props.startingCity ? (
          <p className="mt-1 text-sm text-ink-muted">Starts: {props.startingCity}</p>
        ) : null}
        {props.placesCovered ? (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{props.placesCovered}</p>
        ) : null}
        <ul className="mt-3 space-y-1 text-xs text-ink-subtle">
          <li>Hotel: {props.hotelCategory.replace("_", " ")}</li>
          {props.meals ? <li>Meals: {props.meals}</li> : null}
          {props.transport ? <li>Transport: {props.transport}</li> : null}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-ink-subtle">From</p>
            <p className="text-2xl font-bold text-accent-700">
              {formatINR(props.basePrice)}
              <span className="text-sm font-normal text-ink-subtle"> / person</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={path} variant="secondary" size="sm">
              View Details
            </ButtonLink>
            <ButtonLink href={`${path}?book=1`} size="sm">
              Book Now
            </ButtonLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
