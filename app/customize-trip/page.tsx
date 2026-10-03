import { CustomTripForm } from "@/components/enquiries/CustomTripForm";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getSearchDestinations } from "@/services/homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize My Trip",
  description: "Request a tailored itinerary from Travelling Dreams experts.",
};

export default async function CustomizeTripPage() {
  const destinations = await getSearchDestinations();

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-2xl">
        <SectionHeading
          title="Customize My Trip"
          description="Tell us your dates, style and budget—we will respond with a personalized plan."
        />
        <div className="mt-10">
          <CustomTripForm destinations={destinations} />
        </div>
      </div>
    </div>
  );
}
