import { OfferCard } from "@/components/home/OfferCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getActiveOffers } from "@/services/homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers",
  description: "Seasonal deals and package offers from Travelling Dreams.",
};

export default async function OffersPage() {
  const offers = await getActiveOffers(20);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading title="Special Offers" align="center" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <OfferCard key={o.id} {...o} />
          ))}
        </div>
      </div>
    </div>
  );
}
