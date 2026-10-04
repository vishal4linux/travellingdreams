export const SITE = {
  name: "Travelling Dreams",
  partner: "LA Riqueza Hotels LLP",
  partnerTagline: "Hospitality Partner: LA Riqueza Hotels",
  partnerWebsite: "https://lariquezahotels.com/",
  partnerEmail: "info@lariquezahotels.com",
  partnerPhones: ["+91 98109 65967", "+91 98119 98192", "+91 1169652672"] as const,
  partnerOffice:
    "Office no 531, Westend Mall Janakpuri, New Delhi 110058",
  tagline: "Handpicked hotels, unforgettable holidays and customized journeys across India.",
  regions: ["Uttarakhand", "Himachal Pradesh", "Delhi"] as const,
  whatsappMessageDefault:
    "Hi Travelling Dreams, I would like help planning my trip.",
} as const;

/** Official LA Riqueza partner hotel names (see lariquezahotels.com) */
export const LA_RIQUEZA_PROPERTY_NAMES = [
  "LA Riqueza Hotel Raunsali – Kanatal",
  "LA Riqueza Hotel Dhanolti View – Dhanolti",
  "LA Riqueza Hotel Koala Inn Mcleodganj – Dharamshala",
  "LA Riqueza Hotel Galleu Hill Resort – Kufri, Shimla",
  "London Castle by LA Riqueza – Kanatal (opening soon)",
] as const;

export const ASSOCIATED_PROPERTY_NAMES = [
  ...LA_RIQUEZA_PROPERTY_NAMES,
  "Horizon by Shanti – New Delhi",
] as const;

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
