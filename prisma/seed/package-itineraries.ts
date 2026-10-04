export type SeedItineraryDay = {
  dayNumber: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  hotelSlug?: string;
  destinationSlug?: string;
  imageUrl?: string;
};

const HOTELS = {
  raunsali: {
    slug: "la-riqueza-raunsali-kanatal",
    dest: "uttarakhand",
    lat: 30.4199,
    lng: 78.3436,
    name: "LA Riqueza Hotel Raunsali – Kanatal",
  },
  dhanolti: {
    slug: "la-riqueza-dhanolti-view",
    dest: "uttarakhand",
    lat: 30.4246,
    lng: 78.2397,
    name: "LA Riqueza Hotel Dhanolti View – Dhanolti",
  },
  koala: {
    slug: "la-riqueza-koala-inn-mcleodganj",
    dest: "himachal-pradesh",
    lat: 32.2423,
    lng: 76.3236,
    name: "LA Riqueza Hotel Koala Inn Mcleodganj",
  },
  galleu: {
    slug: "galleu-hill-resort-kufri",
    dest: "himachal-pradesh",
    lat: 31.0978,
    lng: 77.2674,
    name: "LA Riqueza Hotel Galleu Hill Resort – Kufri",
  },
  horizon: {
    slug: "horizon-by-shanti-delhi",
    dest: "delhi",
    lat: 28.6219,
    lng: 77.087,
    name: "Horizon by Shanti – New Delhi",
  },
} as const;

export const PACKAGE_ITINERARIES: Record<string, SeedItineraryDay[]> = {
  "kanatal-la-riqueza-raunsali-escape": [
    {
      dayNumber: 1,
      title: "Delhi to Kanatal · Welcome to the Himalayas",
      description:
        "Private transfer from Delhi NCR to Kanatal (approx. 7–8 hrs). Check in at LA Riqueza Hotel Raunsali—a 4-star retreat with Gangotri range views. Evening at leisure on the terrace.",
      meals: "Dinner",
      stay: HOTELS.raunsali.name,
      locationName: "Kanatal, Uttarakhand",
      latitude: HOTELS.raunsali.lat,
      longitude: HOTELS.raunsali.lng,
      hotelSlug: HOTELS.raunsali.slug,
      destinationSlug: HOTELS.raunsali.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Mussoorie day trip · Gun Hill & Landour",
      description:
        "Scenic drive to Mussoorie (39 km). Visit Gun Hill Point, Landour Clock Tower and Mall Road. Return to Raunsali for a quiet mountain evening—book direct for best-rate partner benefits.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.raunsali.name,
      locationName: "Mussoorie",
      latitude: 30.4598,
      longitude: 78.0644,
      hotelSlug: HOTELS.raunsali.slug,
      destinationSlug: HOTELS.raunsali.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Surkanda Devi & local nature walks",
      description:
        "Morning trek or drive to Surkanda Devi (12 km). Afternoon nature walk and bonfire (seasonal) at the hotel. Optional spa and travel-desk support from LA Riqueza team.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.raunsali.name,
      locationName: "Surkanda Devi, Kanatal",
      latitude: 30.492,
      longitude: 78.38,
      hotelSlug: HOTELS.raunsali.slug,
      destinationSlug: HOTELS.raunsali.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 4,
      title: "Departure to Delhi",
      description: "Relaxed breakfast, checkout and transfer to Delhi with photo stops en route.",
      meals: "Breakfast",
      locationName: "New Delhi",
      latitude: 28.6139,
      longitude: 77.209,
      destinationSlug: "delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28c165307a4?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "dhanaulti-la-riqueza-view-retreat": [
    {
      dayNumber: 1,
      title: "Arrive Dhanolti · Pine forest check-in",
      description:
        "Drive via Mussoorie–Chamba scenic route to LA Riqueza Hotel Dhanolti View. Settle into your pine-forest facing room on the kutcha forest road experience described on lariquezahotels.com.",
      meals: "Dinner",
      stay: HOTELS.dhanolti.name,
      locationName: "Dhanolti, Tehri Garhwal",
      latitude: HOTELS.dhanolti.lat,
      longitude: HOTELS.dhanolti.lng,
      hotelSlug: HOTELS.dhanolti.slug,
      destinationSlug: HOTELS.dhanolti.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Eco Park & forest trails",
      description:
        "Visit Eco Park Dhanolti (3 km), leisure walks and sunset viewpoints. In-house dining with mountain produce.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.dhanolti.name,
      locationName: "Eco Park, Dhanolti",
      latitude: 30.431,
      longitude: 78.245,
      hotelSlug: HOTELS.dhanolti.slug,
      destinationSlug: HOTELS.dhanolti.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Surkanda Devi · Departure",
      description: "Morning darshan at Surkanda Devi (8 km), breakfast and checkout. Transfer to Delhi or Haridwar.",
      meals: "Breakfast",
      locationName: "Haridwar",
      latitude: 29.9457,
      longitude: 78.1642,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "rishikesh-kanatal-spiritual-hills": [
    {
      dayNumber: 1,
      title: "Delhi · Horizon by Shanti stopover",
      description:
        "Arrive New Delhi. Optional night at Horizon by Shanti (Janakpuri) before the hills—ideal for late flights.",
      meals: "Breakfast",
      stay: HOTELS.horizon.name,
      locationName: "New Delhi",
      latitude: HOTELS.horizon.lat,
      longitude: HOTELS.horizon.lng,
      hotelSlug: HOTELS.horizon.slug,
      destinationSlug: HOTELS.horizon.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28c165307a4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Rishikesh · Ganga Aarti & rafting",
      description:
        "Transfer to Rishikesh. Evening Ganga aarti at Triveni Ghat. Optional white-water rafting (seasonal) with certified operators.",
      meals: "Breakfast & Dinner",
      locationName: "Rishikesh",
      latitude: 30.0869,
      longitude: 78.2676,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Kanatal · LA Riqueza Raunsali",
      description:
        "Scenic drive to Kanatal. Check in at LA Riqueza Hotel Raunsali—4-star Himalayan views, direct-booking savings up to 15%.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.raunsali.name,
      locationName: "Kanatal",
      latitude: HOTELS.raunsali.lat,
      longitude: HOTELS.raunsali.lng,
      hotelSlug: HOTELS.raunsali.slug,
      destinationSlug: HOTELS.raunsali.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 4,
      title: "Dhanolti View extension (optional route)",
      description:
        "Day visit or overnight at sister property LA Riqueza Dhanolti View—pine forests on the Mussoorie–Chamba route.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.dhanolti.name,
      locationName: "Dhanolti",
      latitude: HOTELS.dhanolti.lat,
      longitude: HOTELS.dhanolti.lng,
      hotelSlug: HOTELS.dhanolti.slug,
      destinationSlug: HOTELS.dhanolti.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 5,
      title: "Mussoorie stroll · Return",
      description: "Morning in Kanatal, Mussoorie Mall Road stop, descend to Delhi.",
      meals: "Breakfast",
      locationName: "Mussoorie",
      latitude: 30.4598,
      longitude: 78.0644,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "dharamshala-mcleodganj-retreat": [
    {
      dayNumber: 1,
      title: "Delhi to McLeod Ganj",
      description: "Overnight or day transfer to Dharamshala hills. Check in at LA Riqueza Koala Inn Mcleodganj.",
      meals: "Dinner",
      stay: HOTELS.koala.name,
      locationName: "McLeod Ganj",
      latitude: HOTELS.koala.lat,
      longitude: HOTELS.koala.lng,
      hotelSlug: HOTELS.koala.slug,
      destinationSlug: HOTELS.koala.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Dalai Lama Temple & Bhagsu",
      description: "Visit Dalai Lama Temple Complex, Bhagsu Waterfall and local café trail.",
      meals: "Breakfast",
      stay: HOTELS.koala.name,
      locationName: "Bhagsu Waterfall",
      latitude: 32.2503,
      longitude: 76.3276,
      hotelSlug: HOTELS.koala.slug,
      destinationSlug: HOTELS.koala.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Triund viewpoint · Departure",
      description: "Optional short trek toward Triund base or Dharamshala cricket stadium visit. Return transfer.",
      meals: "Breakfast",
      locationName: "Dharamshala",
      latitude: 32.219,
      longitude: 76.3234,
      destinationSlug: "himachal-pradesh",
      imageUrl:
        "https://images.unsplash.com/photo-1611892440502-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "shimla-kufri-weekend": [
    {
      dayNumber: 1,
      title: "Delhi to Kufri · Galleu Hill Resort",
      description:
        "Arrive at LA Riqueza Galleu Hill Resort—20 valley-view rooms and Indian & Chinese dining as featured on lariquezahotels.com.",
      meals: "Dinner",
      stay: HOTELS.galleu.name,
      locationName: "Kufri, Shimla",
      latitude: HOTELS.galleu.lat,
      longitude: HOTELS.galleu.lng,
      hotelSlug: HOTELS.galleu.slug,
      destinationSlug: HOTELS.galleu.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Kufri Fun World · Shimla Mall",
      description: "Kufri snow activities (winter), Himalayan Nature Park, evening at Shimla Ridge & Mall Road.",
      meals: "Breakfast",
      stay: HOTELS.galleu.name,
      locationName: "Shimla Mall Road",
      latitude: 31.1048,
      longitude: 77.1734,
      hotelSlug: HOTELS.galleu.slug,
      destinationSlug: HOTELS.galleu.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Return to Delhi",
      description: "Breakfast, checkout and scenic drive to Delhi NCR.",
      meals: "Breakfast",
      locationName: "New Delhi",
      latitude: 28.6139,
      longitude: 77.209,
      destinationSlug: "delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28c165307a4?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "uttarakhand-rishikesh-mussorie-kanatal": [
    {
      dayNumber: 1,
      title: "Delhi · Rishikesh arrival",
      description: "Drive to Rishikesh. Check in, evening Ganga aarti.",
      meals: "Dinner",
      locationName: "Rishikesh",
      latitude: 30.0869,
      longitude: 78.2676,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 2,
      title: "Rafting · Haridwar",
      description: "Morning rafting, afternoon Haridwar dip and temples.",
      meals: "Breakfast & Dinner",
      locationName: "Haridwar",
      latitude: 29.9457,
      longitude: 78.1642,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1586500036706-34d271c8a96e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 3,
      title: "Mussoorie heritage walk",
      description: "Transfer to Mussoorie—Colonial Mall, Kempty Falls (optional).",
      meals: "Breakfast & Dinner",
      locationName: "Mussoorie",
      latitude: 30.4598,
      longitude: 78.0644,
      destinationSlug: "uttarakhand",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 4,
      title: "Kanatal · LA Riqueza Raunsali",
      description: "Move to Kanatal partner stay at LA Riqueza Hotel Raunsali.",
      meals: "Breakfast & Dinner",
      stay: HOTELS.raunsali.name,
      locationName: "Kanatal",
      latitude: HOTELS.raunsali.lat,
      longitude: HOTELS.raunsali.lng,
      hotelSlug: HOTELS.raunsali.slug,
      destinationSlug: HOTELS.raunsali.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 5,
      title: "Dhanolti day · Partner hotel option",
      description: "Optional visit to LA Riqueza Dhanolti View for lunch and forest walk.",
      meals: "Breakfast & Dinner",
      locationName: "Dhanolti",
      latitude: HOTELS.dhanolti.lat,
      longitude: HOTELS.dhanolti.lng,
      hotelSlug: HOTELS.dhanolti.slug,
      destinationSlug: HOTELS.dhanolti.dest,
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      dayNumber: 6,
      title: "Departure",
      description: "Checkout and return to Delhi.",
      meals: "Breakfast",
      locationName: "New Delhi",
      latitude: 28.6139,
      longitude: 77.209,
      destinationSlug: "delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28c165307a4?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

export function itineraryForPackage(
  packageSlug: string,
  fallback: { startingCity?: string | null; placesCovered?: string | null; durationDays: number }
): SeedItineraryDay[] {
  const custom = PACKAGE_ITINERARIES[packageSlug];
  if (custom?.length) return custom;

  const days = Math.max(2, Math.min(fallback.durationDays, 8));
  const firstPlace =
    fallback.placesCovered?.split("·")[1]?.trim() ??
    fallback.placesCovered?.split(",")[0]?.trim() ??
    "destination";

  return Array.from({ length: days }, (_, i) => {
    const dayNumber = i + 1;
    const isFirst = dayNumber === 1;
    const isLast = dayNumber === days;
    return {
      dayNumber,
      title: isFirst
        ? `Arrival · ${fallback.startingCity ?? "Gateway city"}`
        : isLast
          ? "Departure"
          : `Explore ${firstPlace}`,
      description: isFirst
        ? `Arrive in ${fallback.startingCity ?? "your gateway city"}. Private transfer to hotel, trip briefing with Travelling Dreams coordinator.`
        : isLast
          ? "Breakfast, checkout and transfer to airport or railway station."
          : `Full day of sightseeing across ${fallback.placesCovered ?? "the itinerary route"} with private vehicle and local guide support.`,
      meals: isLast ? "Breakfast" : isFirst ? "Dinner" : "Breakfast & Dinner",
      stay: isLast ? undefined : "Handpicked partner hotel",
      locationName: isFirst ? fallback.startingCity ?? undefined : firstPlace,
    };
  });
}
