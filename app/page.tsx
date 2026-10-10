import { BlogCard } from "@/components/home/BlogCard";
import { DestinationCard } from "@/components/home/DestinationCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HorizontalScrollRow } from "@/components/home/HorizontalScrollRow";
import { HotelCard } from "@/components/home/HotelCard";
import { MoodTrips } from "@/components/home/MoodTrips";
import { OfferCard } from "@/components/home/OfferCard";
import { PackageCard } from "@/components/home/PackageCard";
import { PopularSearches } from "@/components/home/PopularSearches";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ButtonLink } from "@/components/ui/button";
import { TRUST_FEATURES, SITE } from "@/lib/constants/site";
import { decimalToNumber } from "@/lib/serialize";
import { getSiteSettings, setting } from "@/lib/site-settings";
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
    siteSettings,
  ] = await Promise.all([
    getPopularDestinations(),
    getSearchDestinations(),
    getPartnerHotels(),
    getFeaturedPackages(),
    getActiveOffers(),
    getPublishedBlogs(),
    getActiveTestimonials(),
    getSiteSettings(),
  ]);

  const heroTitle = setting(siteSettings, "homepage_hero_title", "Experience India, Better");
  const heroSubtitle = setting(siteSettings, "homepage_hero_subtitle", SITE.tagline);
  const partnerTagline = setting(
    siteSettings,
    "homepage_partner_tagline",
    SITE.partnerTagline
  );
  const waNumber = setting(siteSettings, "whatsapp_number", "");
  const whatsappUrl = waNumber
    ? buildWhatsAppUrl(undefined, waNumber)
    : buildWhatsAppUrl();

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden bg-brand-950 text-white">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-950/50" aria-hidden />
        <div className="hero-mesh absolute inset-0" aria-hidden />
        <div className="container-site relative flex min-h-[88vh] flex-col justify-center pb-28 pt-10 md:pb-32 md:pt-14">
          <p className="glass-chip inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {partnerTagline}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl text-balance">
            {heroTitle.includes("Better") ? (
              <>
                {heroTitle.replace(/\s*Better\s*$/i, "").trim() || "Experience India,"}{" "}
                <span className="font-display italic font-semibold text-accent-300">Better</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100 md:text-xl">{heroSubtitle}</p>
          <HeroSearch destinations={searchDestinations} />
          <TrendingDestinations destinations={destinations} />
        </div>
      </section>

      <TrustStrip />
      <PopularSearches />

      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            eyebrow="Travellers' favourite"
            title="Trending destinations"
            titleAccent="destinations"
            description="Handpicked regions we know deeply—from Himachal peaks to Rajasthan heritage."
          />
          <div className="mt-10 lg:hidden">
            <HorizontalScrollRow>
              {destinations.map((d) => (
                <div key={d.id} className="w-[240px] shrink-0">
                  <DestinationCard {...d} />
                </div>
              ))}
            </HorizontalScrollRow>
          </div>
          <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-4">
            {destinations.map((d) => (
              <DestinationCard key={d.id} {...d} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/destinations" variant="secondary" size="lg">
              View all destinations
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            eyebrow="Our handpicked"
            title="Trip-worthy holiday packages"
            titleAccent="holiday packages"
            description="Fixed departures and curated routes with meals, transport and stays included."
          />
          <div className="mt-10 lg:hidden">
            <HorizontalScrollRow>
              {packages.map((p) => {
                const dest = p.destinations[0]?.destination;
                return (
                  <div key={p.id} className="w-[320px] shrink-0">
                    <PackageCard
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
                  </div>
                );
              })}
            </HorizontalScrollRow>
          </div>
          <div className="mt-10 hidden gap-8 md:grid md:grid-cols-2 xl:grid-cols-3">
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
          <div className="mt-10 text-center">
            <ButtonLink href="/packages" size="lg">
              Explore all packages
            </ButtonLink>
          </div>
        </div>
      </section>

      <MoodTrips />

      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            eyebrow={SITE.partner}
            title="Partner hotels you'll love"
            titleAccent="love"
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
          <div className="mt-10 text-center">
            <ButtonLink href="/la-riqueza-hotels" variant="outline" size="lg">
              All LA Riqueza properties
            </ButtonLink>
          </div>
        </div>
      </section>

      {offers.length > 0 ? (
        <section className="section-padding">
          <div className="container-site">
            <SectionHeading
              eyebrow="Don't miss out"
              title="Grab the offer before it's gone"
              titleAccent="offer"
              align="center"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {offers.map((o) => (
                <OfferCard key={o.id} {...o} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            eyebrow="Why us"
            title="Why choose Travelling Dreams"
            titleAccent="Travelling Dreams"
            description="Built for discerning travelers who want clarity, comfort and expert support."
            align="center"
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_FEATURES.map((item) => (
              <li key={item.title} className="glass-dark rounded-3xl p-6 transition hover:border-white/30">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {blogs.length > 0 ? (
        <section className="section-padding">
          <div className="container-site">
            <SectionHeading
              eyebrow="Travel inspiration"
              title="Picture-perfect ideas"
              titleAccent="ideas"
              description="Planning tips for Spiti, Kashmir, Ladakh and more."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map((b) => (
                <BlogCard key={b.slug} {...b} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section className="section-padding">
          <div className="container-site">
            <SectionHeading
              eyebrow="Traveller reviews"
              title="Loved by our guests"
              titleAccent="guests"
              align="center"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} {...t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden py-16 text-white">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"
          aria-hidden
        />
        <div className="container-site relative">
          <div className="glass-dark mx-auto max-w-4xl rounded-[2rem] px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-bold md:text-5xl text-balance">
            Plan your dream vacation
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-brand-100">
            Speak with our travel experts in Uttarakhand, Himachal and Delhi—or start online in
            minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/packages" size="lg" className="min-w-[160px]">
              Explore Packages
            </ButtonLink>
            <ButtonLink href="/customize-trip" variant="secondary" size="lg" className="min-w-[160px]">
              Customize My Trip
            </ButtonLink>
            {whatsappUrl !== "#" ? (
              <ButtonLink href={whatsappUrl} variant="whatsapp" size="lg" className="min-w-[160px]">
                Chat on WhatsApp
              </ButtonLink>
            ) : null}
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
