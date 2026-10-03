type Props = {
  name: string;
  description: string;
  url: string;
  image?: string;
  address: string;
  city: string;
  state: string;
  rating?: number;
  reviewCount?: number;
};

export function HotelJsonLd(props: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: props.name,
    description: props.description,
    url: props.url,
    image: props.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: props.address,
      addressLocality: props.city,
      addressRegion: props.state,
      addressCountry: "IN",
    },
    ...(props.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: props.rating,
            reviewCount: props.reviewCount ?? 1,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
