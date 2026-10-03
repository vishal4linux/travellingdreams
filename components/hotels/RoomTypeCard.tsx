import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { MEAL_PLAN_LABELS, hotelBookQuery } from "@/lib/constants/hotel";
import { formatINR } from "@/lib/utils";
import type { RoomStayAvailability } from "@/services/room-inventory";
import type { MealPlan } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  hotelPath: string;
  name: string;
  slug: string;
  description: string | null;
  maxAdults: number;
  maxChildren: number;
  bedType: string | null;
  roomSizeSqm: number | null;
  mealPlan: MealPlan;
  baseRate: number;
  discountedRate: number | null;
  imageUrl: string | null;
  amenityNames: string[];
  bookContext: {
    checkIn?: string;
    checkOut?: string;
    rooms?: number;
    adults?: number;
    children?: number;
  };
  availability?: RoomStayAvailability | null;
};

export function RoomTypeCard(props: Props) {
  const rate = props.discountedRate ?? props.baseRate;
  const qs = hotelBookQuery({ ...props.bookContext, room: props.slug });
  const bookHref = `${props.hotelPath}/book${qs || "?room=" + props.slug}`;
  const avail = props.availability;
  const canBook = avail ? avail.canBook : true;

  return (
    <article
      className={`rounded-2xl border bg-surface-elevated p-4 md:p-5 ${
        avail && !avail.canBook ? "border-border opacity-90" : "border-border"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {props.imageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:w-48">
            <Image src={props.imageUrl} alt={props.name} fill className="object-cover" sizes="192px" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col">
          <h3 className="font-display text-xl font-semibold">{props.name}</h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
            <li>Up to {props.maxAdults} adults</li>
            <li>{props.maxChildren} children</li>
            {props.bedType ? <li>{props.bedType}</li> : null}
            {props.roomSizeSqm ? <li>{props.roomSizeSqm} m²</li> : null}
            <li>{MEAL_PLAN_LABELS[props.mealPlan]}</li>
          </ul>
          {props.description ? (
            <p className="mt-2 text-sm text-ink-muted">{props.description}</p>
          ) : null}
          {props.amenityNames.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {props.amenityNames.map((a) => (
                <li key={a}>
                  <Badge className="bg-brand-50 text-brand-800">{a}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
          {avail ? (
            <div className="mt-3 text-sm">
              {avail.canBook ? (
                <p className="font-medium text-green-800">
                  {avail.minAvailable <= 3
                    ? `Only ${avail.minAvailable} room(s) left for your dates`
                    : `${avail.minAvailable} rooms available for your stay`}
                </p>
              ) : (
                <p className="flex items-start gap-1.5 text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {!avail.fitsGuests
                    ? "This room type cannot fit your guest count. Add more rooms or choose another category."
                    : "Not available for the selected dates."}
                </p>
              )}
            </div>
          ) : null}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <div>
              {props.discountedRate != null && props.discountedRate < props.baseRate ? (
                <p className="text-sm text-ink-subtle line-through">{formatINR(props.baseRate)}</p>
              ) : null}
              <p className="font-display text-2xl font-semibold text-brand-800">
                {formatINR(rate)}
                <span className="text-sm font-normal text-ink-subtle"> / night</span>
              </p>
            </div>
            {canBook ? (
              <ButtonLink href={bookHref} size="sm">
                Select room
              </ButtonLink>
            ) : (
              <span className="inline-flex h-9 items-center rounded-xl px-4 text-sm text-ink-subtle">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
