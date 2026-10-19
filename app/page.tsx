import { BlogCard } from "@/components/home/BlogCard";
import { HomeDiscover } from "@/components/home/HomeDiscover";
import { HotelCard } from "@/components/home/HotelCard";
import { OfferCard } from "@/components/home/OfferCard";
import { OfferPrompt } from "@/components/home/OfferPrompt";
import { PosterRail } from "@/components/home/PosterRail";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { TripTile } from "@/components/home/TripTile";
import { ButtonLink } from "@/components/ui/button";
import { TRUST_FEATURES, SITE } from "@/lib/constants/site";
import { decimalToNumber } from "@/lib/serialize";
import { getSiteSettings, setting } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPopularDestinations } from "@/services/destinations";
import {
  getActiveOffers,
  getActiveTestimonials,
  getHomePackages,
  getPartnerHotels,
  getPublishedBlogs,
  getSearchDestinations,
} from "@/services/homepage";
import { Compass, Heart, Mountain, Palmtree, Sun, Users } from "lucide-react";
import Link from "next/link";

const vibes = [
  { label: "Mountains", href: "/packages?q=himachal", icon: Mountain },
  { label: "Heritage", href: "/packages?q=rajasthan", icon: Compass },
  { label: "Honeymoon", href: "/packages?q=honeymoon", icon: Heart },
  { label: "Family", href: "/packages?q=family", icon: Users },
  { label: "Weekend", href: "/packages?q=delhi", icon: Sun },
  { label: "Relax", href: "/packages?q=uttarakhand", icon: Palmtree },
];

const fallback =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";

export default async function HomePage() {
  const [
    destinations,
    searchDestinations,
    partnerHotels,
    packages,
    offers,
    blogs,
    testimonials,
    siteSettings,
  ] = await Promise.all([
    getPopularDestinations(),
    getSearchDestinations(),
    getPartnerHotels(6),
    getHomePackages(8),
    getActiveOffers(),
    getPublishedBlogs(),
    getActiveTestimonials(3),
    getSiteSettings(),
  ]);

  const heroTitle = setting(siteSettings, "homepage_hero_title", "Experience India, Better");
  const partnerTagline = setting(siteSettings, "homepage_partner_tagline", SITE.partnerTagline);
  const waNumber = setting(siteSettings, "whatsapp_number", "");
  const whatsappUrl = waNumber ? buildWhatsAppUrl(undefined, waNumber) : buildWhatsAppUrl();

  return (
    <div className="bg-[#f7f4ef]">
      <h1 className="sr-only">{heroTitle}</h1>
      <HomeDiscover destinations={searchDestinations} />
      <OfferPrompt />

      <section className="border-b border-brand-100 bg-white">
        <div className="container-site grid grid-cols-2 gap-4 py-6 sm:grid-cols-4">
          {[
            ["10,000+", "Happy travellers"],
            ["Handpicked", "Holiday packages"],
            ["LA Riqueza", "Partner hotels"],
            ["Clear rates", "Before you book"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-lg font-bold text-brand-900 sm:text-xl">{value}</p>
              <p className="text-sm text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <PosterRail
        title="Where do you want to go?"
        href="/destinations"
        linkLabel="All places"
        items={destinations.map((d) => ({
          href: `/destinations/${d.slug}`,
          title: d.name,
          subtitle: d.state,
          image: d.cardImage ?? fallback,
        }))}
      />

      <section className="bg-white py-10">
        <div className="container-site">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-accent-700">Top picks</p>
              <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Holiday packages with prices</h2>
            </div>
            <Link href="/packages" className="shrink-0 text-sm font-bold text-brand-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((p) => {
              const dest = p.destinations[0]?.destination;
              return (
                <TripTile
                  key={p.id}
                  href={`/packages/${dest?.slug ?? "india"}/${p.slug}`}
                  title={p.title}
                  image={p.heroImage}
                  place={dest?.name ?? "India"}
                  nights={p.durationNights}
                  days={p.durationDays}
                  price={decimalToNumber(p.basePrice) ?? 0}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-ink">Pick a vibe</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {vibes.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-sm font-bold text-brand-900 shadow-sm hover:bg-accent-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-12 text-white">
        <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wider text-accent-300">{partnerTagline}</p>
            <h2 className="mt-2 text-3xl font-bold">Want a route that is not on the list?</h2>
            <p className="mt-2 text-brand-100">
              Tell us the dates, group size and places. We send a clear itinerary and the rate.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/customize-trip" size="lg">Plan my trip</ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">Ask for rates</ButtonLink>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-site">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-accent-700">Stays</p>
              <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Partner hotels</h2>
            </div>
            <Link href="/la-riqueza-hotels" className="shrink-0 text-sm font-bold text-brand-800 hover:underline">
              All hotels
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {partnerHotels.map((h) => (
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
      </section>

      {offers.length > 0 ? (
        <section className="bg-white py-10">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-ink">Offers running now</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {offers.map((o) => (
                <OfferCard key={o.id} {...o} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-10">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-ink">Why travellers book with us</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_FEATURES.map((item) => (
              <li key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-bold text-brand-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {blogs.length > 0 ? (
        <section className="bg-white py-10">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-ink">Travel ideas</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map((b) => (
                <BlogCard key={b.slug} {...b} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section className="py-10">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-ink">Guest reviews</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} {...t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-brand-900 py-14 text-white">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Browse a package, book a hotel, or send us the trip you actually want.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/packages" size="lg">See packages</ButtonLink>
            <ButtonLink href="/customize-trip" variant="secondary" size="lg">Customize</ButtonLink>
            {whatsappUrl !== "#" ? (
              <ButtonLink href={whatsappUrl} variant="whatsapp" size="lg">WhatsApp</ButtonLink>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
