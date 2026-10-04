import { SectionHeading } from "@/components/layout/SectionHeading";
import { SITE, TRUST_FEATURES } from "@/lib/constants/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Travelling Dreams and LA Riqueza Hotels partnership.",
};

export default function AboutPage() {
  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-3xl">
        <SectionHeading title={`About ${SITE.name}`} description={SITE.tagline} />
        <p className="mt-8 leading-relaxed text-ink-muted">
          {SITE.name} is a premium travel brand specializing in North India—handpicked hotels,
          fixed departures and customized holidays. Our hospitality partner {SITE.partner} (New Delhi)
          brings 20+ years of hotel management expertise with properties in Kanatal, Dhanolti, McLeod Ganj
          and Kufri—plus hotel leasing, representation and sales & marketing services across India.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {TRUST_FEATURES.map((f) => (
            <li key={f.title} className="rounded-xl border border-border p-4">
              <p className="font-medium">{f.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
