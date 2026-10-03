import { ButtonLink } from "@/components/ui/button";
import { getDestinationBySlug } from "@/services/destinations";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) return {};
  return {
    title: dest.metaTitle ?? `${dest.name} Travel Guide & Packages`,
    description: dest.metaDescription ?? dest.tagline ?? undefined,
    openGraph: {
      title: dest.name,
      description: dest.tagline ?? undefined,
      images: dest.heroImage ? [{ url: dest.heroImage }] : undefined,
    },
    alternates: { canonical: `/destinations/${slug}` },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const hero =
    dest.heroImage ??
    dest.cardImage ??
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2070&auto=format&fit=crop";

  const packages = dest.packageDestinations
    .map((pd) => pd.package)
    .filter((p) => p.isPublished);

  return (
    <div>
      <section className="relative min-h-[40vh] bg-brand-950 text-white">
        <Image src={hero} alt="" fill className="object-cover opacity-50" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent" />
        <div className="container-site relative flex min-h-[40vh] flex-col justify-end pb-12 pt-24">
          {dest.state ? (
            <p className="text-sm uppercase tracking-widest text-brand-200">{dest.state}</p>
          ) : null}
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{dest.name}</h1>
          {dest.tagline ? <p className="mt-4 max-w-2xl text-lg text-brand-100">{dest.tagline}</p> : null}
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {dest.description ? (
              <div className="prose prose-stone max-w-none text-ink-muted">
                {dest.description.split("\n").map((para) => (
                  <p key={para.slice(0, 24)} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-2xl border border-border bg-brand-50 p-6">
            <h2 className="font-display text-xl font-semibold">Plan this destination</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Search stays and packages or request a fully custom itinerary.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <ButtonLink href={`/hotels?destination=${slug}`}>Search hotels</ButtonLink>
              <ButtonLink href={`/packages?destination=${slug}`} variant="secondary">
                View packages
              </ButtonLink>
              <ButtonLink href="/customize-trip" variant="ghost">
                Customize my trip
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {dest.hotels.length > 0 ? (
        <section className="border-t border-border bg-brand-50/30 py-16">
          <div className="container-site">
            <h2 className="font-display text-2xl font-semibold">Hotels in {dest.name}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {dest.hotels.map((h) => (
                <li key={h.slug}>
                  <ButtonLink
                    href={`/hotels/${slug}/${h.slug}`}
                    variant="secondary"
                    className="h-auto w-full justify-start px-4 py-3 text-left"
                  >
                    <span className="font-medium">{h.name}</span>
                    <span className="ml-2 text-ink-muted">· {h.city}</span>
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {packages.length > 0 ? (
        <section className="section-padding bg-surface">
          <div className="container-site">
            <h2 className="font-display text-2xl font-semibold">Packages</h2>
            <ul className="mt-6 space-y-4">
              {packages.map((p) => (
                <li
                  key={p.slug}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border p-5"
                >
                  <div>
                    <p className="font-display text-lg font-semibold">{p.title}</p>
                    <p className="text-sm text-ink-muted">
                      {p.durationNights} nights / {p.durationDays} days
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display text-xl text-brand-800">
                      {formatINR(decimalToNumber(p.basePrice) ?? 0)}
                    </p>
                    <ButtonLink href={`/packages/${slug}/${p.slug}`} size="sm">
                      View details
                    </ButtonLink>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
