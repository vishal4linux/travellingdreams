import { countNights } from "@/lib/dates";
import type { StayContext } from "@/services/availability";
import Link from "next/link";

type Props = {
  stay: StayContext;
  hotelListHref: string;
};

export function HotelStayBanner({ stay, hotelListHref }: Props) {
  const nights = countNights(stay.checkIn, stay.checkOut);

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
      <p>
        <strong>{stay.checkIn}</strong> → <strong>{stay.checkOut}</strong> · {nights}{" "}
        {nights === 1 ? "night" : "nights"} · {stay.rooms} room(s) · {stay.adults} adult(s)
        {stay.children ? ` · ${stay.children} child(ren)` : ""}
      </p>
      <Link href={hotelListHref} className="mt-1 inline-block font-medium text-brand-700 underline-offset-4 hover:underline">
        Change dates
      </Link>
    </div>
  );
}
