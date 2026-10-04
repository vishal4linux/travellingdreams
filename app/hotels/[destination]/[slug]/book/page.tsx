import { GuestCheckoutForm } from "@/components/booking/GuestCheckoutForm";
import { ButtonLink } from "@/components/ui/button";
import { hotelDetailPath } from "@/lib/constants/hotel";
import { parseHotelSearchParams } from "@/lib/hotel-search";
import { stayContextFromFilters } from "@/services/availability";
import { calculateHotelStayPrice } from "@/services/pricing/hotel";
import { getHotelDetailWithAvailability } from "@/services/hotels";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ destination: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HotelBookPage({ params, searchParams }: Props) {
  const { destination, slug } = await params;
  const raw = await searchParams;
  const filters = parseHotelSearchParams(raw);
  const { ctx: stayContext, error: stayError } = stayContextFromFilters(filters);
  const roomSlug = String(raw.room ?? "");

  const { hotel, roomAvailability } = await getHotelDetailWithAvailability(
    destination,
    slug,
    stayContext
  );
  if (!hotel || !stayContext) notFound();

  const room = hotel.roomTypes.find((r) => r.slug === roomSlug);
  if (!room) notFound();

  const avail = roomAvailability?.get(room.id);
  if (stayError || !avail?.canBook) {
    return (
      <div className="section-padding bg-surface">
        <div className="container-site max-w-lg">
          <h1 className="font-display text-3xl font-semibold">Cannot proceed</h1>
          <p className="mt-4 text-ink-muted">{stayError ?? "Room unavailable for these dates."}</p>
          <ButtonLink href={hotelDetailPath(destination, slug)} className="mt-8" variant="secondary">
            Back to hotel
          </ButtonLink>
        </div>
      </div>
    );
  }

  const pricing = calculateHotelStayPrice(
    room,
    stayContext.checkIn,
    stayContext.checkOut,
    stayContext.rooms
  );

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <h1 className="font-display text-3xl font-semibold">Complete your hotel booking</h1>
        <p className="mt-2 text-ink-muted">
          {hotel.name} · {room.name}
        </p>
        <div className="mt-10">
          <GuestCheckoutForm
            apiPath="/api/bookings/hotel"
            payload={{
              destinationSlug: destination,
              hotelSlug: slug,
              roomSlug: room.slug,
              checkIn: stayContext.checkIn,
              checkOut: stayContext.checkOut,
              rooms: stayContext.rooms,
              adults: stayContext.adults,
              children: stayContext.children,
            }}
            summary={{
              label: `${hotel.name} — ${room.name}`,
              total: pricing.totalAmount,
              lines: [
                `${pricing.nights} night(s) × ${stayContext.rooms} room(s) @ ${pricing.nightly.toLocaleString("en-IN")}/night`,
                `Subtotal ${pricing.subtotal.toLocaleString("en-IN")}`,
                `Tax (${pricing.taxPercent}%) ${pricing.taxAmount.toLocaleString("en-IN")}`,
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
