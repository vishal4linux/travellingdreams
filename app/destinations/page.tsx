import { DestinationCard } from "@/components/home/DestinationCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getAllDestinations } from "@/services/destinations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore Himachal, Spiti, Kashmir, Ladakh, Uttarakhand, Rajasthan and Delhi with Travelling Dreams.",
};

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          eyebrow="India"
          title="Destinations"
          description="Every region below can be extended with new routes from the admin panel—no code changes required."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard key={d.id} {...d} />
          ))}
        </div>
      </div>
    </div>
  );
}
