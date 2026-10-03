import { SectionHeading } from "@/components/layout/SectionHeading";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Travelling Dreams for hotel and holiday bookings.",
};

type Props = { searchParams: Promise<{ submitted?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { submitted } = await searchParams;
  const wa = buildWhatsAppUrl();

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-2xl">
        <SectionHeading title="Contact Us" description="Offices in Uttarakhand, Himachal Pradesh and Delhi NCR." />
        {submitted ? (
          <p className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            Thank you—your enquiry was received. Our team will contact you shortly.
          </p>
        ) : null}
        <ul className="mt-8 space-y-3 text-ink-muted">
          <li>Email: hello@travellingdreams.in</li>
          <li>Phone / WhatsApp: see site footer</li>
          <li>Regions: {SITE.regions.join(", ")}</li>
        </ul>
        {wa !== "#" ? (
          <a href={wa} className="mt-8 inline-flex rounded-xl bg-[#25D366] px-6 py-3 text-white">
            Chat on WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
