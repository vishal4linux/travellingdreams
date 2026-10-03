export const SITE = {
  name: "Travelling Dreams",
  partner: "LA Riqueza Hotels",
  partnerTagline: "Hospitality Partner: LA Riqueza Hotels",
  tagline: "Handpicked hotels, unforgettable holidays and customized journeys across India.",
  regions: ["Uttarakhand", "Himachal Pradesh", "Delhi"] as const,
  whatsappMessageDefault:
    "Hi Travelling Dreams, I would like help planning my trip.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/packages", label: "Holiday Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/la-riqueza-hotels", label: "LA Riqueza Hotels" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export const TRUST_FEATURES = [
  {
    title: "Handpicked Hotels",
    description: "Curated stays including LA Riqueza properties across North India.",
  },
  {
    title: "Customized Itineraries",
    description: "Trips tailored for families, couples, adventure seekers and pilgrims.",
  },
  {
    title: "Transparent Pricing",
    description: "Clear inclusions, taxes and cancellation terms before you pay.",
  },
  {
    title: "Local Travel Experts",
    description: "On-ground teams in Uttarakhand, Himachal and Delhi NCR.",
  },
  {
    title: "24×7 Assistance",
    description: "Support on WhatsApp and phone throughout your journey.",
  },
  {
    title: "Secure Payments",
    description: "UPI, cards and net banking with encrypted checkout.",
  },
] as const;
