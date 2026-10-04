import { PackageCheckoutForm } from "@/components/booking/PackageCheckoutForm";
import { getPackageDetail } from "@/services/packages";
import { calculatePackagePrice } from "@/services/pricing/package";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ destination: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PackageBookPage({ params, searchParams }: Props) {
  const { destination, slug } = await params;
  const raw = await searchParams;
  const travelDate = String(raw.travelDate ?? new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const adults = Number(raw.adults ?? 2);
  const children = Number(raw.children ?? 0);

  const pkg = await getPackageDetail(destination, slug);
  if (!pkg) notFound();

  const pricing = calculatePackagePrice(
    pkg.basePrice,
    pkg.prices[0]?.adultPrice ?? null,
    pkg.prices[0]?.childPrice ?? null,
    adults,
    children
  );

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <h1 className="font-display text-3xl font-semibold">Book {pkg.title}</h1>
        <PackageCheckoutForm
          destinationSlug={destination}
          packageSlug={slug}
          travelDate={travelDate}
          adults={adults}
          childCount={children}
          label={pkg.title}
          baseTotal={pricing.totalAmount}
          summaryLines={[
            `Travel date: ${travelDate}`,
            `${adults} adult(s)${children ? `, ${children} child(ren)` : ""}`,
            `Subtotal ${pricing.subtotal.toLocaleString("en-IN")}`,
          ]}
          departures={pkg.dates.map((d) => ({
            id: d.id,
            startDate: d.startDate.toISOString().slice(0, 10),
            seatsLeft: d.seats - d.booked,
          }))}
        />
      </div>
    </div>
  );
}
