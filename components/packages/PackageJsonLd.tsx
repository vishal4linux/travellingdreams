import { safeJsonLd } from "@/lib/safe-json-ld";

type Props = {
  title: string;
  description?: string | null;
  url: string;
  price: number;
  image?: string | null;
  durationDays: number;
};

export function PackageJsonLd({ title, description, url, price, image, durationDays }: Props) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://travellingdreams.in";
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: description ?? title,
    url: `${site}${url}`,
    image: image ? [image] : undefined,
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: durationDays,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
