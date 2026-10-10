import { PackageDayPlan } from "@/components/packages/PackageDayPlan";
import { PackageFaqList } from "@/components/packages/PackageFaqList";
import { PackageJourneyMap } from "@/components/packages/PackageJourneyMap";
import { PackageJsonLd } from "@/components/packages/PackageJsonLd";
import { PackageMobileBar } from "@/components/packages/PackageMobileBar";
import { PackagePhotoGallery } from "@/components/packages/PackagePhotoGallery";
import { SaveItineraryButton } from "@/components/packages/SaveItineraryButton";
import { ButtonLink } from "@/components/ui/button";
import { splitLines, stayStops } from "@/lib/package-copy";
import { decimalToNumber } from "@/lib/serialize";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPackageDetail } from "@/services/packages";
import { Check, Star, X } from "lucide-react";
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
  const highlights = splitLines(pkg.highlights);
  const inclusions = splitLines(pkg.inclusions);
  const exclusions = splitLines(pkg.exclusions);
  const knowBefore = splitLines(pkg.terms);
  const stops = stayStops(pkg.itinerary);
  const itineraryHref = `/packages/${destination}/${slug}/itinerary`;
  const bookHref = `/packages/${destination}/${slug}/book`;
  const wa = buildWhatsAppUrl(
    `Hi Travelling Dreams, I am interested in the ${pkg.title} package for [dates] for [number] travelers.`
  );

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

      <section className="relative min-h-[42vh] bg-brand-950 text-white">
        {hero ? <Image src={hero} alt="" fill className="object-cover opacity-55" priority /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-brand-950/20" />
        <div className="container-site relative flex min-h-[42vh] flex-col justify-end pb-10 pt-28">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-300">{destName}</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">{pkg.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="glass-chip rounded-full px-3 py-1 text-sm font-semibold">
              {pkg.durationDays}D / {pkg.durationNights}N
            </span>
            {stops.map((stop) => (
              <span key={stop.name} className="glass-chip rounded-full px-3 py-1 text-sm">
                {stop.days} {stop.days === 1 ? "day" : "days"} in {stop.name}
              </span>
            ))}
            {pkg.rating != null ? (
              <span className="glass-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                {pkg.rating.toFixed(1)}
                {pkg.reviewCount ? ` (${pkg.reviewCount})` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="sticky top-[4.6rem] z-30 border-b border-white/40 bg-[#f7efe6]/75 backdrop-blur-xl">
        <div className="container-site flex gap-1 overflow-x-auto py-2 text-sm font-semibold">
          {[
            ["#overview", "Overview"],
            ["#itinerary", "Itinerary"],
            ["#inclusions", "Inclusions"],
            ["#policies", "Know before you go"],
            ["#faq", "FAQs"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-full px-3 py-2 text-ink-muted hover:bg-white/60 hover:text-ink">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="container-site section-padding pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-14">
            <section id="overview" className="scroll-mt-32">
              {highlights.length ? (
                <ul className="space-y-3">
                  {highlights.map((line) => (
                    <li key={line} className="flex gap-3 text-ink">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {pkg.description ? (
                <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-muted">{pkg.description}</p>
              ) : null}
              {pkg.placesCovered ? (
                <p className="mt-4 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">Places covered: </span>
                  {pkg.placesCovered}
                </p>
              ) : null}
            </section>

            <PackagePhotoGallery images={pkg.images} title={pkg.title} />

            {pkg.attractions.length || pkg.itinerary.some((d) => d.latitude != null) ? (
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
            ) : null}

            {pkg.itinerary.length ? (
              <section id="itinerary" className="scroll-mt-32">
                <h2 className="text-2xl font-bold tracking-tight text-ink">Itinerary</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Open each day for the plan, meals and stay. Download the full sheet from the booking card.
                </p>
                <div className="mt-5">
                  <PackageDayPlan days={pkg.itinerary} />
                </div>
              </section>
            ) : null}

            <section id="inclusions" className="scroll-mt-32">
              <h2 className="text-2xl font-bold tracking-tight text-ink">Inclusions & exclusions</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="glass rounded-3xl p-5">
                  <h3 className="font-semibold text-ink">Inclusions</h3>
                  <ul className="mt-4 space-y-2.5">
                    {(inclusions.length ? inclusions : ["Shared in the itinerary"]).map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-ink-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-3xl p-5">
                  <h3 className="font-semibold text-ink">Exclusions</h3>
                  <ul className="mt-4 space-y-2.5">
                    {(exclusions.length ? exclusions : ["Personal expenses"]).map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-ink-muted">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {knowBefore.length || pkg.cancellationPolicy ? (
              <section id="policies" className="scroll-mt-32">
                <h2 className="text-2xl font-bold tracking-tight text-ink">Know before you go</h2>
                {knowBefore.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                    {knowBefore.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {pkg.cancellationPolicy ? (
                  <div className="glass mt-5 rounded-3xl p-5">
                    <h3 className="font-semibold text-ink">Cancellation</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                      {pkg.cancellationPolicy}
                    </p>
                  </div>
                ) : null}
              </section>
            ) : (
              <div id="policies" />
            )}

            {pkg.faqs.length ? (
              <section id="faq" className="scroll-mt-32">
                <h2 className="text-2xl font-bold tracking-tight text-ink">FAQs</h2>
                <div className="mt-5">
                  <PackageFaqList faqs={pkg.faqs} />
                </div>
              </section>
            ) : (
              <div id="faq" />
            )}
          </div>

          <aside className="lg:sticky lg:top-36 lg:self-start">
            <div className="glass rounded-[1.75rem] p-5">
              <p className="text-sm text-ink-muted">Per adult from</p>
              <p className="font-display text-4xl font-semibold text-brand-800">{formatINR(base)}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {pkg.durationNights} nights / {pkg.durationDays} days
                {pkg.startingCity ? ` · starts ${pkg.startingCity}` : ""}
              </p>
              <dl className="mt-4 space-y-2 text-sm text-ink-muted">
                <div className="flex justify-between gap-3">
                  <dt>Meals</dt>
                  <dd className="text-right text-ink">{pkg.meals ?? "As per itinerary"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Transport</dt>
                  <dd className="text-right text-ink">{pkg.transport ?? "Private vehicle"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Stay</dt>
                  <dd className="text-right text-ink">{pkg.hotelCategory.replaceAll("_", " ")}</dd>
                </div>
              </dl>
              <ButtonLink href={bookHref} className="mt-5 w-full" size="lg">
                Book now
              </ButtonLink>
              <SaveItineraryButton
                href={itineraryHref}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/40 text-sm font-medium text-ink hover:bg-white/70"
              />
              <ButtonLink href="/customize-trip" variant="secondary" className="mt-2 w-full">
                Customize package
              </ButtonLink>
              {wa !== "#" ? (
                <ButtonLink href={wa} variant="whatsapp" className="mt-2 w-full">
                  Chat on WhatsApp
                </ButtonLink>
              ) : null}
              {pkg.dates.length ? (
                <p className="mt-3 text-xs text-ink-subtle">
                  {pkg.dates.length} upcoming departure{pkg.dates.length === 1 ? "" : "s"} at checkout.
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
      <PackageMobileBar basePrice={base} bookHref={bookHref} whatsappHref={wa} />
    </div>
  );
}
