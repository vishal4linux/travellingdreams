import { SITE } from "@/lib/constants/site";
import { Phone } from "lucide-react";
import Link from "next/link";

const footerDestinations = [
  { href: "/destinations/himachal-pradesh", label: "Himachal Pradesh" },
  { href: "/destinations/spiti-valley", label: "Spiti Valley" },
  { href: "/destinations/kashmir", label: "Kashmir" },
  { href: "/destinations/leh-ladakh", label: "Leh Ladakh" },
  { href: "/destinations/uttarakhand", label: "Uttarakhand" },
  { href: "/destinations/rajasthan", label: "Rajasthan" },
  { href: "/destinations/delhi", label: "Delhi" },
  { href: "/destinations/punjab", label: "Punjab & Amritsar" },
];

const footerLinks = {
  explore: [
    { href: "/packages", label: "Holiday packages" },
    { href: "/hotels", label: "Hotels" },
    { href: "/la-riqueza-hotels", label: "LA Riqueza Hotels" },
    { href: "/offers", label: "Offers" },
    { href: "/customize-trip", label: "Custom itinerary" },
  ],
  support: [
    { href: "/contact", label: "Ask for rates" },
    { href: "/account/lookup", label: "Find my booking" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cancellation", label: "Cancellation" },
    { href: "/refund", label: "Refunds" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();
  const phone = SITE.partnerPhones[0].replace(/\s/g, "");

  return (
    <footer className="mt-8 bg-brand-950 text-brand-100">
      <div className="bg-brand-800">
        <div className="container-site flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white sm:text-xl">Need a custom itinerary or today’s rates?</p>
            <p className="mt-1 text-sm text-brand-100">
              Tell us the dates, group size and places. We reply with a clear quote.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/customize-trip"
              className="rounded-xl bg-accent-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-accent-500"
            >
              Plan my trip
            </Link>
            <Link
              href="/contact"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-brand-900 hover:bg-brand-50"
            >
              Send a query
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-white">{SITE.name}</p>
          <p className="mt-2 text-sm font-medium text-accent-300">{SITE.partnerTagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-200">
            Hotels and holiday packages across {SITE.regions.join(", ")} and beyond.
          </p>
          <a href={`tel:${phone}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
            <Phone className="h-4 w-4 text-accent-300" />
            {SITE.partnerPhones[0]}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent-300">Destinations</h2>
          <ul className="mt-4 space-y-2">
            {footerDestinations.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-brand-100 hover:text-accent-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent-300">Explore</h2>
          <ul className="mt-4 space-y-2">
            {footerLinks.explore.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-brand-100 hover:text-accent-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent-300">Help</h2>
          <ul className="mt-4 space-y-2">
            {footerLinks.support.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-brand-100 hover:text-accent-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-sm text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>Uttarakhand · Himachal Pradesh · Delhi</p>
        </div>
      </div>
    </footer>
  );
}
