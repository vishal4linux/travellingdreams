import { BlogCard } from "@/components/home/BlogCard";
import { DestinationCard } from "@/components/home/DestinationCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HotelCard } from "@/components/home/HotelCard";
import { OfferCard } from "@/components/home/OfferCard";
import { PackageCard } from "@/components/home/PackageCard";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ButtonLink } from "@/components/ui/button";
import { TRUST_FEATURES, SITE } from "@/lib/constants/site";
import { decimalToNumber } from "@/lib/serialize";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPopularDestinations } from "@/services/destinations";
import {
  getActiveOffers,
  getActiveTestimonials,
  getFeaturedPackages,
  getPartnerHotels,
  getPublishedBlogs,
  getSearchDestinations,
} from "@/services/homepage";

export default async function HomePage() {
  const [
    destinations,
    searchDestinations,
    partnerHotels,
    packages,
    offers,
    blogs,
    testimonials,
  ] = await Promise.all([
    getPopularDestinations(),
    getSearchDestinations(),
    getPartnerHotels(),
    getFeaturedPackages(),
    getActiveOffers(),
    getPublishedBlogs(),
    getActiveTestimonials(),
  ]);

  const whatsappUrl = buildWhatsAppUrl();

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/75 via-brand-950/55 to-brand-950" />
        <div className="container-site relative pb-16 pt-12 md:pb-24 md:pt-16">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-200">
            {SITE.partnerTagline}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl text-balance">
            Travel Beyond Expectations
          </h1>
          <p className="mt-6 max-w-xl text-lg text-brand-100">{SITE.tagline}</p>
          <HeroSearch destinations={searchDestinations} />
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            eyebrow="Explore India"
            title="Popular Destinations"
            description="Handpicked regions we know deeply—from Himachal peaks to Rajasthan heritage."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => (
              <DestinationCard key={d.id} {...d} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/destinations" variant="secondary">
              View all destinations
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-50/50">
        <div className="container-site">
          <SectionHeading
            eyebrow={SITE.partner}
            title="Partner Hotels"
            description="LA Riqueza properties across Uttarakhand and Himachal, Horizon by Shanti in Delhi, and London Castle Kanatal opening soon."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
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
          <div className="mt-8 text-center">
            <ButtonLink href="/la-riqueza-hotels" variant="outline">
              All LA Riqueza properties
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            eyebrow="Holiday packages"
            title="Featured Holiday Packages"
            description="Fixed departures and curated routes with meals, transport and stays included."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((p) => {
              const dest = p.destinations[0]?.destination;
              return (
                <PackageCard
                  key={p.id}
                  title={p.title}
                  slug={p.slug}
                  destinationSlug={dest?.slug ?? "india"}
                  destinationName={dest?.name ?? "India"}
                  durationNights={p.durationNights}
                  durationDays={p.durationDays}
                  startingCity={p.startingCity}
                  placesCovered={p.placesCovered}
                  hotelCategory={p.hotelCategory}
                  meals={p.meals}
                  transport={p.transport}
                  basePrice={decimalToNumber(p.basePrice) ?? 0}
                  rating={p.rating}
                  heroImage={p.heroImage}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-950 text-brand-100">
        <div className="container-site">
          <SectionHeading
            eyebrow="Why us"
            title="Why Choose Travelling Dreams"
            description="Built for discerning travelers who want clarity, comfort and expert support."
            align="center"
            className="[&_h2]:text-white [&_p]:text-brand-200"
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_FEATURES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-brand-800 bg-brand-900/40 p-6"
              >
                <h3 className="font-display text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading eyebrow="Deals" title="Special Offers" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((o) => (
              <OfferCard key={o.id} {...o} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-50/40">
        <div className="container-site">
          <SectionHeading
            eyebrow="Travel inspiration"
            title="Guides & Ideas"
            description="Planning tips for Spiti, Kashmir, Ladakh and more."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.map((b) => (
              <BlogCard key={b.slug} {...b} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading title="What Travelers Say" align="center" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-800 py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
        <div className="container-site relative text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl text-balance">
            Plan Your Dream Vacation
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-100">
            Speak with our travel experts in Uttarakhand, Himachal and Delhi—or start online in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/packages" size="lg">
              Explore Packages
            </ButtonLink>
            <ButtonLink href="/customize-trip" variant="secondary" size="lg">
              Customize My Trip
            </ButtonLink>
            {whatsappUrl !== "#" ? (
              <ButtonLink href={whatsappUrl} variant="whatsapp" size="lg">
                Chat on WhatsApp
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
