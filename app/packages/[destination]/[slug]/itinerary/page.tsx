import { SaveItineraryButton } from "@/components/packages/SaveItineraryButton";
import { splitLines, stayStops } from "@/lib/package-copy";
import { decimalToNumber } from "@/lib/serialize";
import { formatINR } from "@/lib/utils";
import { SITE } from "@/lib/constants/site";
import { getPackageDetail } from "@/services/packages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ destination: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Itinerary · ${slug}`, robots: { index: false, follow: false } };
}

export default async function PackageItineraryDownloadPage({ params }: Props) {
  const { destination, slug } = await params;
  const pkg = await getPackageDetail(destination, slug);
  if (!pkg) notFound();

  const base = decimalToNumber(pkg.basePrice) ?? 0;
  const inclusions = splitLines(pkg.inclusions);
  const exclusions = splitLines(pkg.exclusions);
  const knowBefore = splitLines(pkg.terms);
  const stops = stayStops(pkg.itinerary);

  return (
    <article className="itinerary-sheet mx-auto max-w-3xl px-6 py-10 text-ink">
      <div className="no-print mb-6 flex justify-end">
        <SaveItineraryButton className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-600 px-5 text-sm font-medium text-white" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">{SITE.name}</p>
      <h1 className="mt-2 text-3xl font-bold">{pkg.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {pkg.durationDays} days / {pkg.durationNights} nights · from {formatINR(base)} per adult
        {pkg.startingCity ? ` · starts ${pkg.startingCity}` : ""}
      </p>
      {stops.length ? (
        <p className="mt-2 text-sm text-ink-muted">
          {stops.map((s) => `${s.days}d ${s.name}`).join(" · ")}
        </p>
      ) : null}

      <section className="mt-8">
        <h2 className="text-lg font-bold">Day-by-day</h2>
        <ol className="mt-4 space-y-5">
          {pkg.itinerary.map((day) => (
            <li key={day.id} className="border-t border-stone-200 pt-4">
              <p className="font-semibold">
                Day {day.dayNumber}: {day.title}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                {[day.locationName, day.meals ? `Meals: ${day.meals}` : null, day.stay ? `Stay: ${day.stay}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                {day.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold">Inclusions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold">Exclusions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {exclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {knowBefore.length ? (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Know before you go</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {knowBefore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {pkg.cancellationPolicy ? (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Cancellation</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{pkg.cancellationPolicy}</p>
        </section>
      ) : null}

      <p className="mt-10 text-xs text-ink-subtle">
        {SITE.name} · {SITE.partnerTagline}. Prices and hotels can change with dates and availability.
      </p>
    </article>
  );
}
