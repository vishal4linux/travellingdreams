import { PackageJsonLd } from "@/components/packages/PackageJsonLd";
import { PackageMobileBar } from "@/components/packages/PackageMobileBar";
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
      <section className="relative min-h-[40vh] bg-brand-950 text-white">
        {hero ? <Image src={hero} alt="" fill className="object-cover opacity-45" priority /> : null}
        <div className="container-site relative flex min-h-[40vh] flex-col justify-end pb-12 pt-24">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{pkg.title}</h1>
          <p className="mt-3 text-lg text-brand-100">
            {pkg.durationNights} nights / {pkg.durationDays} days · from {formatINR(base)}
          </p>
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
            {pkg.placesCovered ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">Places covered</h2>
                <p className="mt-3 text-ink-muted">{pkg.placesCovered}</p>
              </section>
            ) : null}
            {pkg.itinerary.length ? (
              <section>
                <h2 className="font-display text-2xl font-semibold">Itinerary</h2>
                <ol className="mt-4 space-y-4">
                  {pkg.itinerary.map((day) => (
                    <li key={day.dayNumber} className="rounded-xl border border-border p-4">
                      <p className="font-medium">
                        Day {day.dayNumber}: {day.title}
                      </p>
                      <p className="mt-2 text-sm text-ink-muted">{day.description}</p>
                      {day.meals ? <p className="mt-1 text-xs text-ink-subtle">Meals: {day.meals}</p> : null}
                      {day.stay ? <p className="text-xs text-ink-subtle">Stay: {day.stay}</p> : null}
                    </li>
                  ))}
                </ol>
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
