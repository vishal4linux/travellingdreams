import { SITE } from "@/lib/constants/site";
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
    { href: "/packages", label: "Holiday Packages" },
    { href: "/hotels", label: "Hotels" },
    { href: "/la-riqueza-hotels", label: "LA Riqueza Hotels" },
    { href: "/offers", label: "Offers" },
    { href: "/inspiration", label: "Travel Inspiration" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/customize-trip", label: "Customize My Trip" },
    { href: "/account/bookings", label: "My Booking" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/cancellation", label: "Cancellation Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-brand-950 text-brand-100">
      <div className="container-site section-padding pb-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl font-semibold text-white">
              {SITE.name}
            </p>
            <p className="mt-2 text-sm text-brand-200">{SITE.partnerTagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-300">
              Premium hotel stays and handcrafted holiday packages across{" "}
              {SITE.regions.join(", ")} and beyond.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-200">
              Destinations
            </h3>
            <ul className="mt-4 space-y-2">
              {footerDestinations.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-200">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-200">
              Support & Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {[...footerLinks.support, ...footerLinks.legal].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brand-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-400">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-brand-400">
            <span>Uttarakhand</span>
            <span aria-hidden>·</span>
            <span>Himachal Pradesh</span>
            <span aria-hidden>·</span>
            <span>Delhi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
