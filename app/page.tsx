import { BlogCard } from "@/components/home/BlogCard";
import { HomeDiscover } from "@/components/home/HomeDiscover";
import { HotelCard } from "@/components/home/HotelCard";
import { OfferCard } from "@/components/home/OfferCard";
import { OfferPrompt } from "@/components/home/OfferPrompt";
import { PosterRail } from "@/components/home/PosterRail";
import { TestimonialCard } from "@/components/home/TestimonialCard";
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

  const fallback =
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";

  return (
    <div>
      <h1 className="sr-only">{heroTitle}</h1>
      <p className="sr-only">{heroSubtitle}</p>
      <HomeDiscover destinations={searchDestinations} />
      <OfferPrompt />
      <PosterRail
        title="Trending places"
        href="/destinations"
        linkLabel="All places"
        items={destinations.map((d) => ({
          href: `/destinations/${d.slug}`,
          title: d.name,
          subtitle: d.tagline ?? d.state,
          image: d.cardImage ?? fallback,
        }))}
      />
      <PosterRail
        title="Holiday packages"
        href="/packages"
        linkLabel="All packages"
        items={packages.map((p) => {
          const dest = p.destinations[0]?.destination;
          return {
            href: `/packages/${dest?.slug ?? "india"}/${p.slug}`,
            title: p.title,
            subtitle: `${p.durationNights}N / ${p.durationDays}D · ${dest?.name ?? "India"}`,
            image: p.heroImage ?? fallback,
          };
        })}
      />

      <section className="py-10">
        <div className="container-site">
          <SectionHeading
            eyebrow={partnerTagline}
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
