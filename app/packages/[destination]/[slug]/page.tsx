import { PackageItineraryExplorer } from "@/components/packages/PackageItineraryExplorer";
import { PackageJourneyMap } from "@/components/packages/PackageJourneyMap";
import { PackageJsonLd } from "@/components/packages/PackageJsonLd";
import { PackageMobileBar } from "@/components/packages/PackageMobileBar";
import { PackagePhotoGallery } from "@/components/packages/PackagePhotoGallery";
import { ButtonLink } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPackageDetail } from "@/services/packages";
import { decimalToNumber } from "@/lib/serialize";
import { formatINR } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ destination: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination, slug } = await params;
  const pkg = await getPackageDetail(destination, slug);
  if (!pkg) return {};
  return {
    title: pkg.metaTitle ?? pkg.title,
    description: pkg.metaDescription ?? pkg.highlights ?? undefined,
    alternates: { canonical: `/packages/${destination}/${slug}` },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { destination, slug } = await params;
  const pkg = await getPackageDetail(destination, slug);
  if (!pkg) notFound();

  const hero = pkg.heroImage ?? pkg.images[0]?.url;
  const destName = pkg.destinations[0]?.destination.name ?? destination;
  const base = decimalToNumber(pkg.basePrice) ?? 0;
  const wa = buildWhatsAppUrl(
    `Hi Travelling Dreams, I am interested in the ${pkg.title} package for [dates] for [number] travelers.`
  );

  const bookHref = `/packages/${destination}/${slug}/book`;

  return (
    <div className="pb-24 md:pb-0">
      <PackageJsonLd
        title={pkg.title}
        description={pkg.highlights}
        url={`/packages/${destination}/${slug}`}
        price={base}
        image={hero}
        durationDays={pkg.durationDays}
      />
      <section className="relative min-h-[45vh] bg-brand-950 text-white">
        {hero ? <Image src={hero} alt="" fill className="object-cover opacity-50" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />
        <div className="container-site relative flex min-h-[45vh] flex-col justify-end pb-12 pt-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-300">{destName}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{pkg.title}</h1>
          <p className="mt-3 text-lg text-brand-100">
            {pkg.durationNights} nights / {pkg.durationDays} days · from {formatINR(base)} / person
          </p>
          {pkg.placesCovered ? (
            <p className="mt-2 max-w-2xl text-sm text-brand-200">{pkg.placesCovered}</p>
          ) : null}
        </div>
      </section>

      <div className="container-site section-padding">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {pkg.highlights ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">Highlights</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{pkg.highlights}</p>
              </section>
            ) : null}
            <PackagePhotoGallery images={pkg.images} title={pkg.title} />

            {pkg.attractions.length || pkg.itinerary.some((d) => d.latitude != null) ? (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Explore the journey
                </h2>
                <p className="mt-2 text-ink-muted">
                  Click any pin to learn why that place is famous — viewpoints, temples, food
                  stops and must-visits on this tour.
                </p>
                <div className="mt-6">
                  <PackageJourneyMap
                    packageTitle={pkg.title}
                    places={pkg.attractions
                      .filter((a) => a.latitude != null && a.longitude != null)
                      .map((a) => ({
                        id: a.id,
                        name: a.name,
                        tagline: a.tagline,
                        whyVisit: a.whyVisit,
                        description: a.description,
                        category: a.category,
                        dayNumber: a.dayNumber,
                        latitude: a.latitude as number,
                        longitude: a.longitude as number,
                        imageUrl: a.imageUrl,
                      }))}
                    days={pkg.itinerary.map((d) => ({
                      dayNumber: d.dayNumber,
                      title: d.title,
                      locationName: d.locationName,
                      latitude: d.latitude,
                      longitude: d.longitude,
                    }))}
                  />
                </div>
              </section>
            ) : null}

            {pkg.itinerary.length ? (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-ink">Day-by-day itinerary</h2>
                <p className="mt-2 text-ink-muted">
                  Tap each day for photos, meals, partner stays and open locations on Maps.
                </p>
                <div className="mt-6">
                  <PackageItineraryExplorer days={pkg.itinerary} packageTitle={pkg.title} />
                </div>
              </section>
            ) : null}
            {pkg.inclusions ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">Inclusions</h2>
                <p className="mt-3 whitespace-pre-line text-ink-muted">{pkg.inclusions}</p>
              </section>
            ) : null}
            {pkg.exclusions ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">Exclusions</h2>
                <p className="mt-3 whitespace-pre-line text-ink-muted">{pkg.exclusions}</p>
              </section>
            ) : null}
            {pkg.faqs.length ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">FAQ</h2>
                <ul className="mt-4 space-y-3">
                  {pkg.faqs.map((f) => (
                    <li key={f.id} className="rounded-xl border border-border p-4">
                      <p className="font-medium">{f.question}</p>
                      <p className="mt-2 text-sm text-ink-muted">{f.answer}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-ink-muted">{destName}</p>
              <p className="font-display text-3xl font-semibold text-brand-800">{formatINR(base)}</p>
              <p className="mt-2 text-sm text-ink-muted">Meals: {pkg.meals ?? "As per itinerary"}</p>
              <p className="text-sm text-ink-muted">Transport: {pkg.transport ?? "Private vehicle"}</p>
              <ButtonLink href={bookHref} className="mt-5 w-full" size="lg">
                Book now
              </ButtonLink>
              {pkg.dates.length ? (
                <p className="mt-3 text-xs text-ink-subtle">
                  {pkg.dates.length} upcoming fixed departure(s) available at checkout.
                </p>
              ) : null}
              <ButtonLink href="/customize-trip" variant="secondary" className="mt-2 w-full">
                Customize package
              </ButtonLink>
              {wa !== "#" ? (
                <ButtonLink href={wa} variant="whatsapp" className="mt-2 w-full">
                  Chat on WhatsApp
                </ButtonLink>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
      <PackageMobileBar basePrice={base} bookHref={bookHref} whatsappHref={wa} />
    </div>
  );
}
