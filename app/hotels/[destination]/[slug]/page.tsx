import { HotelGallery } from "@/components/hotels/HotelGallery";
import { HotelJsonLd } from "@/components/hotels/HotelJsonLd";
import { HotelMobileBar } from "@/components/hotels/HotelMobileBar";
import { HotelStayBanner } from "@/components/hotels/HotelStayBanner";
import { RoomTypeCard } from "@/components/hotels/RoomTypeCard";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PROPERTY_TYPE_LABELS, hotelBookQuery, hotelDetailPath } from "@/lib/constants/hotel";
import { filtersToSearchParams, parseHotelSearchParams } from "@/lib/hotel-search";
import { stayContextFromFilters } from "@/services/availability";
import { decimalToNumber } from "@/lib/serialize";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getHotelDetail, getHotelDetailWithAvailability } from "@/services/hotels";
import { Clock, MapPin, MessageCircle, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ destination: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination, slug } = await params;
  const hotel = await getHotelDetail(destination, slug);
  if (!hotel) return {};
  const image = hotel.images.find((i) => i.isPrimary)?.url ?? hotel.images[0]?.url;
  return {
    title: hotel.metaTitle ?? hotel.name,
    description: hotel.metaDescription ?? hotel.shortDescription ?? undefined,
    openGraph: {
      title: hotel.name,
      description: hotel.shortDescription ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
    alternates: {
      canonical: hotelDetailPath(destination, slug),
    },
  };
}

export default async function HotelDetailPage({ params, searchParams }: Props) {
  const { destination, slug } = await params;
  const rawSearch = await searchParams;
  const bookContext = parseHotelSearchParams(rawSearch);
  const { ctx: stayContext, error: stayError } = stayContextFromFilters(bookContext);

  const { hotel, roomAvailability } = await getHotelDetailWithAvailability(
    destination,
    slug,
    stayContext
  );
  if (!hotel) notFound();

  const anyRoomAvailable =
    roomAvailability == null
      ? true
      : [...roomAvailability.values()].some((a) => a.canBook);

  const path = hotelDetailPath(destination, slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonicalUrl = `${siteUrl}${path}`;

  const startingRate = hotel.roomTypes.reduce<number | null>((min, r) => {
    const rate = decimalToNumber(r.discountedRate) ?? decimalToNumber(r.baseRate);
    if (rate == null) return min;
    return min == null ? rate : Math.min(min, rate);
  }, null);

  const bookQs = hotelBookQuery({
    checkIn: bookContext.checkIn,
    checkOut: bookContext.checkOut,
    rooms: bookContext.rooms,
    adults: bookContext.adults,
    children: bookContext.children,
  });
  const bookHref = `${path}${bookQs ? `${bookQs}&book=1` : "?book=1"}#rooms`;

  const whatsappHref = buildWhatsAppUrl(
    `Hi Travelling Dreams, I am interested in ${hotel.name} in ${hotel.city}${
      bookContext.checkIn ? ` from ${bookContext.checkIn}` : ""
    }${bookContext.checkOut ? ` to ${bookContext.checkOut}` : ""}.`
  );

  const mapEmbedSrc =
    hotel.latitude != null && hotel.longitude != null
      ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=14&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(`${hotel.city}, ${hotel.state}, India`)}&z=12&output=embed`;

  const showBookBanner = String(rawSearch.book ?? "") === "1";

  return (
    <>
      <HotelJsonLd
        name={hotel.name}
        description={hotel.shortDescription ?? hotel.description ?? hotel.name}
        url={canonicalUrl}
        image={hotel.images[0]?.url}
        address={hotel.address}
        city={hotel.city}
        state={hotel.state}
        rating={hotel.guestRating ?? undefined}
        reviewCount={hotel.reviewCount}
      />

      <div className="pb-24 md:pb-0">
        <div className="container-site section-padding">
          <div className="flex flex-wrap items-center gap-2 text-sm text-brand-700">
            <ButtonLink href="/hotels" variant="ghost" size="sm" className="px-0">
              Hotels
            </ButtonLink>
            <span className="text-ink-subtle">/</span>
            <ButtonLink href={`/destinations/${destination}`} variant="ghost" size="sm" className="px-0">
              {hotel.destination.name}
            </ButtonLink>
          </div>

          {stayError ? (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {stayError}
            </p>
          ) : null}

          {stayContext ? (
            <div className="mt-6">
              <HotelStayBanner
                stay={stayContext}
                hotelListHref={`/hotels?${filtersToSearchParams(bookContext)}`}
              />
            </div>
          ) : null}

          {showBookBanner ? (
            <p className="mt-4 rounded-xl border border-brand-300 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Choose an available room below. Payment and confirmation arrive in Phase 5.
            </p>
          ) : null}

          {stayContext && !anyRoomAvailable ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              No room types are available for this guest combination on the selected dates. Try
              different dates or add more rooms.
            </p>
          ) : null}

          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                {hotel.isLaRiqueza ? (
                  <Badge className="bg-brand-700 text-white">LA Riqueza Hotels</Badge>
                ) : null}
                {hotel.isFeatured ? <Badge>Featured</Badge> : null}
                <Badge className="bg-brand-50 text-brand-800">
                  {PROPERTY_TYPE_LABELS[hotel.propertyType]}
                </Badge>
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{hotel.name}</h1>
              <p className="mt-2 flex items-center gap-1 text-ink-muted">
                <MapPin className="h-4 w-4" />
                {hotel.address}, {hotel.city}, {hotel.state}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                  {hotel.guestRating?.toFixed(1) ?? "New"} · {hotel.reviewCount} reviews
                </span>
                <span>{hotel.starRating}-star</span>
                <span className="flex items-center gap-1 text-ink-muted">
                  <Clock className="h-4 w-4" />
                  Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
                </span>
              </div>

              <div className="mt-8">
                <HotelGallery images={hotel.images} hotelName={hotel.name} />
              </div>

              <section className="mt-10">
                <h2 className="font-display text-2xl font-semibold">Overview</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">
                  {hotel.shortDescription ?? hotel.description}
                </p>
                {hotel.description && hotel.shortDescription !== hotel.description ? (
                  <p className="mt-4 leading-relaxed text-ink-muted">{hotel.description}</p>
                ) : null}
              </section>

              {hotel.amenities.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl font-semibold">Amenities</h2>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {hotel.amenities.map(({ amenity }) => (
                      <li key={amenity.id} className="rounded-lg bg-brand-50 px-3 py-2 text-sm">
                        {amenity.name}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section id="rooms" className="mt-10 scroll-mt-24">
                <h2 className="font-display text-2xl font-semibold">Room types</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Availability is checked for each night of your stay to prevent overbooking.
                </p>
                <ul className="mt-6 space-y-4">
                  {hotel.roomTypes.map((room) => (
                    <li key={room.id}>
                      <RoomTypeCard
                        hotelPath={path}
                        name={room.name}
                        slug={room.slug}
                        description={room.description}
                        maxAdults={room.maxAdults}
                        maxChildren={room.maxChildren}
                        bedType={room.bedType}
                        roomSizeSqm={room.roomSizeSqm}
                        mealPlan={room.mealPlan}
                        baseRate={decimalToNumber(room.baseRate) ?? 0}
                        discountedRate={decimalToNumber(room.discountedRate)}
                        imageUrl={room.images[0]?.url ?? null}
                        amenityNames={room.amenities.map((a) => a.amenity.name)}
                        bookContext={bookContext}
                        availability={roomAvailability?.get(room.id) ?? null}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              {hotel.attractions.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl font-semibold">Nearby attractions</h2>
                  <ul className="mt-4 space-y-3">
                    {hotel.attractions.map((a) => (
                      <li key={a.id} className="rounded-xl border border-border p-4">
                        <p className="font-medium">{a.name}</p>
                        {a.distanceKm != null ? (
                          <p className="text-sm text-ink-muted">{a.distanceKm} km away</p>
                        ) : null}
                        {a.description ? (
                          <p className="mt-1 text-sm text-ink-muted">{a.description}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {hotel.policies ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl font-semibold">Policies</h2>
                  <div className="prose prose-stone mt-3 max-w-none whitespace-pre-line text-sm text-ink-muted">
                    {hotel.policies}
                  </div>
                </section>
              ) : null}

              <section className="mt-10">
                <h2 className="font-display text-2xl font-semibold">Location</h2>
                <div className="mt-4 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title={`Map — ${hotel.name}`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedSrc}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-subtle">
                  Map is indicative. Exact location shared on booking confirmation.
                </p>
              </section>

              {hotel.reviews.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl font-semibold">Guest reviews</h2>
                  <ul className="mt-4 space-y-4">
                    {hotel.reviews.map((r) => (
                      <li key={r.id} className="rounded-xl border border-border p-4">
                        <div className="flex items-center gap-2">
                          <span className="flex gap-0.5 text-brand-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </span>
                          {r.title ? <span className="font-medium">{r.title}</span> : null}
                        </div>
                        <p className="mt-2 text-sm text-ink-muted">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]">
                {startingRate != null ? (
                  <p className="font-display text-3xl font-semibold text-brand-800">
                    {formatINR(startingRate)}
                    <span className="text-base font-normal text-ink-subtle"> / night</span>
                  </p>
                ) : null}
                {bookContext.checkIn && bookContext.checkOut ? (
                  <p className="mt-2 text-sm text-ink-muted">
                    {bookContext.checkIn} → {bookContext.checkOut}
                    {bookContext.rooms ? ` · ${bookContext.rooms} room(s)` : ""}
                  </p>
                ) : null}
                {anyRoomAvailable ? (
                  <ButtonLink href={bookHref} className="mt-5 w-full" size="lg">
                    Book now
                  </ButtonLink>
                ) : (
                  <p className="mt-5 text-sm text-amber-900">No availability for selected dates.</p>
                )}
                {whatsappHref !== "#" ? (
                  <ButtonLink href={whatsappHref} variant="whatsapp" className="mt-2 w-full" size="lg">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </ButtonLink>
                ) : null}
                <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                  Best price guarantee on direct bookings. GST and local taxes calculated at checkout.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <HotelMobileBar
        startingRate={startingRate}
        bookHref={bookHref}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
