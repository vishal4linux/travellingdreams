import type { HotelCategory, PackageTheme } from "@prisma/client";

export const DESTINATIONS = [
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    state: "Himachal Pradesh",
    tagline: "Alpine valleys, cedar forests and mountain towns",
    sortOrder: 1,
    cardImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3c7a14745?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    description:
      "From Shimla’s colonial charm to Manali’s adventure trails, Himachal Pradesh offers year-round escapes for families, couples and trekkers. Travelling Dreams curates stays and road journeys with local experts based in the region.",
  },
  {
    slug: "spiti-valley",
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    tagline: "High-altitude desert, ancient monasteries, raw Himalaya",
    sortOrder: 2,
    cardImage:
      "https://images.unsplash.com/photo-1593691509543-c55fb1088298?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1589516659220-1d2c4a2a4965?q=80&w=2070&auto=format&fit=crop",
    description:
      "Spiti is for travelers who want silence, starry skies and Buddhist heritage. Our Spiti packages include acclimatized itineraries, trusted drivers and handpicked homestays and hotels along the circuit.",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    state: "Jammu & Kashmir",
    tagline: "Dal Lake shikaras, meadows and snow-capped peaks",
    sortOrder: 3,
    cardImage:
      "https://images.unsplash.com/photo-1595819218636-72a394875a46?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1568838358484-4d0d129066d2?q=80&w=2070&auto=format&fit=crop",
    description:
      "Experience Srinagar houseboats, Gulmarg gondolas and Pahalgam pine forests with transparent pricing and verified local guides. Ideal for honeymoons and family summer holidays.",
  },
  {
    slug: "leh-ladakh",
    name: "Leh Ladakh",
    state: "Ladakh",
    tagline: "Passes, pangong blues and monastic trails",
    sortOrder: 4,
    cardImage:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3c7a14745?q=80&w=2070&auto=format&fit=crop",
    description:
      "Ride the highest motorable roads, camp by Pangong and explore Nubra’s dunes with itineraries designed for altitude safety. We handle permits guidance, transport and boutique stays in Leh.",
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    state: "Uttarakhand",
    tagline: "Char Dham routes, hill stations and river valleys",
    sortOrder: 5,
    cardImage:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
    description:
      "Mussoorie, Nainital, Rishikesh and spiritual circuits across Garhwal and Kumaon. Travelling Dreams combines pilgrimage support with leisure extensions and LA Riqueza partner stays.",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    state: "Rajasthan",
    tagline: "Forts, palaces and golden desert sunsets",
    sortOrder: 6,
    cardImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1599661046280-ea9c4530e812?q=80&w=2070&auto=format&fit=crop",
    description:
      "Heritage walks in Jaipur, lake palaces in Udaipur and camel safaris in Jaisalmer—crafted with premium hotels, private transfers and cultural experiences.",
  },
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    tagline: "Gateway city, heritage trails and curated stopovers",
    sortOrder: 7,
    cardImage:
      "https://images.unsplash.com/photo-1587474260587-1362692aa8b4?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1524492412937-b28c165307a4?q=80&w=2070&auto=format&fit=crop",
    description:
      "Start or end your North India journey with airport transfers, Old Delhi food walks and comfortable city hotels—perfect for business and leisure layovers.",
  },
] as const;

export const AMENITIES = [
  "Free Wi-Fi",
  "Restaurant",
  "Room Service",
  "Parking",
  "Mountain View",
  "Heating",
  "Air Conditioning",
  "Travel Desk",
] as const;

export type SeedHotel = {
  slug: string;
  name: string;
  destinationSlug: string;
  city: string;
  state: string;
  starRating: number;
  isFeatured: boolean;
  guestRating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  policies: string;
  latitude: number;
  longitude: number;
  image: string;
  image2?: string;
  amenities: string[];
  roomName: string;
  roomDescription: string;
  baseRate: number;
  discountedRate?: number;
  attractions: { name: string; distanceKm: number; description?: string }[];
  reviews: { rating: number; title: string; body: string; tripType?: string }[];
};

export const LA_RIQUEZA_HOTELS: SeedHotel[] = [
  {
    slug: "la-riqueza-manali",
    name: "LA Riqueza Manali",
    destinationSlug: "himachal-pradesh",
    city: "Manali",
    state: "Himachal Pradesh",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.6,
    reviewCount: 128,
    shortDescription:
      "Boutique stay near Mall Road with warm hospitality, valley views and easy access to Solang and Old Manali.",
    description:
      "LA Riqueza Manali pairs cedar-wood interiors with modern comfort—ideal after a day on the Rohtang or Atal Tunnel route. Our team arranges local taxis, paragliding and snow activities on request.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nFree cancellation up to 72 hours before arrival on prepaid rates.\nValid photo ID required for all guests.\nExtra mattress available for children on chargeable basis.",
    latitude: 32.2432,
    longitude: 77.1892,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Parking", "Mountain View", "Heating"],
    roomName: "Deluxe Valley View",
    roomDescription: "King bed, valley-facing balcony, electric kettle and premium linen.",
    baseRate: 5499,
    discountedRate: 4799,
    attractions: [
      { name: "Mall Road Manali", distanceKm: 0.8, description: "Shops, cafés and evening strolls." },
      { name: "Hadimba Temple", distanceKm: 2.5 },
      { name: "Solang Valley", distanceKm: 14 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Perfect Manali base",
        body: "Clean rooms and honest pricing. The travel desk booked our Solang activities within minutes.",
        tripType: "Family",
      },
    ],
  },
  {
    slug: "la-riqueza-shimla",
    name: "LA Riqueza Shimla",
    destinationSlug: "himachal-pradesh",
    city: "Shimla",
    state: "Himachal Pradesh",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.5,
    reviewCount: 96,
    shortDescription:
      "Elegant rooms overlooking the hills, ideal for family holidays and weekend escapes from Delhi NCR.",
    description:
      "Set on a quiet ridge above the Mall, LA Riqueza Shimla offers heated rooms, in-house dining and concierge support for Kufri, Mashobra and heritage walks.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nPets not allowed.\nGovernment taxes extra as applicable.",
    latitude: 31.1048,
    longitude: 77.1734,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1611892440502-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Room Service", "Parking", "Heating"],
    roomName: "Premium Hill View",
    roomDescription: "Panoramic windows, workspace desk and complimentary breakfast.",
    baseRate: 4999,
    attractions: [
      { name: "The Ridge", distanceKm: 1.2 },
      { name: "Jakhoo Temple", distanceKm: 3 },
      { name: "Kufri", distanceKm: 16 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Weekend done right",
        body: "Valet parking and hot meals after the toy train ride—highly recommend for couples.",
        tripType: "Couple",
      },
    ],
  },
  {
    slug: "la-riqueza-rishikesh",
    name: "LA Riqueza Rishikesh",
    destinationSlug: "uttarakhand",
    city: "Rishikesh",
    state: "Uttarakhand",
    starRating: 4,
    isFeatured: false,
    guestRating: 4.7,
    reviewCount: 74,
    shortDescription:
      "Serene property close to the Ganges with yoga-friendly spaces and curated adventure desk support.",
    description:
      "Wake up to river breeze and attend Ganga aarti with our guided timings. Rafting, bungee and yoga retreats can be bundled with your stay.",
    policies:
      "Check-in 1:00 PM · Check-out 11:00 AM\nNo alcohol in river-facing rooms floor.\nQuiet hours 10 PM – 6 AM.",
    latitude: 30.0869,
    longitude: 78.2676,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Travel Desk", "Parking"],
    roomName: "Ganga Facing Deluxe",
    roomDescription: "Private balcony, river view, yoga mat on request.",
    baseRate: 4299,
    discountedRate: 3999,
    attractions: [
      { name: "Triveni Ghat", distanceKm: 1.5 },
      { name: "Laxman Jhula", distanceKm: 6 },
      { name: "Rajaji National Park", distanceKm: 18 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Peaceful Rishikesh stay",
        body: "Travel desk handled our rafting slot and the breakfast spread was excellent.",
        tripType: "Adventure",
      },
    ],
  },
  {
    slug: "la-riqueza-dehradun",
    name: "LA Riqueza Dehradun",
    destinationSlug: "uttarakhand",
    city: "Dehradun",
    state: "Uttarakhand",
    starRating: 3,
    isFeatured: false,
    guestRating: 4.4,
    reviewCount: 52,
    shortDescription:
      "Comfortable business-friendly hotel with quick airport access and gateway connections to Mussoorie.",
    description:
      "Minutes from Jolly Grant Airport, LA Riqueza Dehradun suits transit guests and Mussoorie-bound travelers with late check-out on request.",
    policies:
      "Check-in 12:00 PM · Check-out 11:00 AM\nAirport transfers on request.\nGST invoice provided for corporate bookings.",
    latitude: 30.3165,
    longitude: 78.0322,
    image:
      "https://images.unsplash.com/photo-1618773928123-c3d0310f0b8b?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Air Conditioning", "Parking"],
    roomName: "Executive Room",
    roomDescription: "Compact smart room with shower cubicle and work desk.",
    baseRate: 3799,
    attractions: [
      { name: "Robber's Cave", distanceKm: 8 },
      { name: "Forest Research Institute", distanceKm: 6 },
      { name: "Mussoorie Road", distanceKm: 2 },
    ],
    reviews: [
      {
        rating: 4,
        title: "Great airport stopover",
        body: "Early flight handled smoothly with packed breakfast.",
        tripType: "Solo",
      },
    ],
  },
];

export type SeedPackage = {
  slug: string;
  title: string;
  destinationSlug: string;
  durationNights: number;
  durationDays: number;
  startingCity: string;
  placesCovered: string;
  hotelCategory: HotelCategory;
  meals: string;
  transport: string;
  basePrice: number;
  rating: number;
  theme: PackageTheme;
  heroImage: string;
  highlights: string;
};

export const FEATURED_PACKAGES: SeedPackage[] = [
  {
    slug: "spiti-valley-explorer",
    title: "Spiti Valley Explorer",
    destinationSlug: "spiti-valley",
    durationNights: 8,
    durationDays: 9,
    startingCity: "Chandigarh",
    placesCovered: "Chandigarh · Narkanda · Sangla · Tabo · Kaza · Key Monastery · Chandratal",
    hotelCategory: "DELUXE",
    meals: "Breakfast & Dinner",
    transport: "Private SUV with experienced driver",
    basePrice: 32999,
    rating: 4.8,
    theme: "ADVENTURE",
    heroImage:
      "https://images.unsplash.com/photo-1593691509543-c55fb1088298?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Acclimatized route, monastery visits, Chandratal camping night and 24×7 trip coordinator.",
  },
  {
    slug: "kashmir-paradise",
    title: "Kashmir Paradise",
    destinationSlug: "kashmir",
    durationNights: 5,
    durationDays: 6,
    startingCity: "Srinagar",
    placesCovered: "Srinagar · Gulmarg · Pahalgam · Dal Lake",
    hotelCategory: "SUPER_DELUXE",
    meals: "Breakfast & Dinner",
    transport: "Private cab",
    basePrice: 24999,
    rating: 4.7,
    theme: "HONEYMOON",
    heroImage:
      "https://images.unsplash.com/photo-1595819218636-72a394875a46?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Houseboat experience, gondola tickets assistance and curated photo stops.",
  },
  {
    slug: "leh-ladakh-adventure",
    title: "Leh Ladakh Adventure",
    destinationSlug: "leh-ladakh",
    durationNights: 6,
    durationDays: 7,
    startingCity: "Leh",
    placesCovered: "Leh · Khardung La · Nubra · Pangong · Shanti Stupa",
    hotelCategory: "DELUXE",
    meals: "Breakfast & Dinner",
    transport: "Innova or Xylo with oxygen support kit",
    basePrice: 28999,
    rating: 4.9,
    theme: "ADVENTURE",
    heroImage:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Permit guidance, altitude-aware pacing and handpicked camps or hotels.",
  },
  {
    slug: "himachal-escape",
    title: "Himachal Escape",
    destinationSlug: "himachal-pradesh",
    durationNights: 5,
    durationDays: 6,
    startingCity: "Delhi",
    placesCovered: "Delhi · Shimla · Manali · Solang Valley",
    hotelCategory: "DELUXE",
    meals: "Breakfast",
    transport: "Private tempo traveller or SUV",
    basePrice: 19999,
    rating: 4.6,
    theme: "FAMILY",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Family-friendly pacing with LA Riqueza partner stays in Shimla and Manali.",
  },
  {
    slug: "uttarakhand-spiritual-mountain-tour",
    title: "Uttarakhand Spiritual & Mountain Tour",
    destinationSlug: "uttarakhand",
    durationNights: 6,
    durationDays: 7,
    startingCity: "Haridwar",
    placesCovered: "Haridwar · Rishikesh · Mussoorie · Dehradun",
    hotelCategory: "DELUXE",
    meals: "Breakfast & Dinner",
    transport: "Private cab",
    basePrice: 21999,
    rating: 4.5,
    theme: "SPIRITUAL",
    heroImage:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Ganga aarti, gentle trekking options and pilgrimage assistance on request.",
  },
  {
    slug: "rajasthan-heritage-journey",
    title: "Rajasthan Heritage Journey",
    destinationSlug: "rajasthan",
    durationNights: 7,
    durationDays: 8,
    startingCity: "Jaipur",
    placesCovered: "Jaipur · Jodhpur · Udaipur · Jaisalmer",
    hotelCategory: "LUXURY",
    meals: "Breakfast",
    transport: "Private chauffeur-driven sedan",
    basePrice: 45999,
    rating: 4.8,
    theme: "HERITAGE",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Fort guides, heritage hotels and sunset desert camp with cultural show.",
  },
];

export const OFFERS = [
  {
    slug: "early-bird-offer",
    title: "Early Bird Offer",
    badge: "Save 15%",
    description: "Book 45 days ahead on select Himachal and Uttarakhand packages.",
  },
  {
    slug: "honeymoon-package",
    title: "Honeymoon Package",
    badge: "Couples",
    description: "Complimentary cake and room décor on Kashmir and Manali honeymoons.",
  },
  {
    slug: "family-package",
    title: "Family Package",
    badge: "Kids stay free",
    description: "One child under 8 stays free on participating LA Riqueza hotels.",
  },
  {
    slug: "weekend-escape",
    title: "Weekend Escape",
    badge: "Delhi NCR",
    description: "Two-night hill breaks from Delhi with cab and breakfast included.",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Priya & Rohan Mehta",
    location: "Delhi",
    rating: 5,
    trip: "Kashmir Paradise",
    review:
      "Flawless coordination from airport pickup to houseboat check-in. Pricing matched the final invoice—no surprises.",
  },
  {
    name: "Ankit Sharma",
    location: "Chandigarh",
    rating: 5,
    trip: "Spiti Valley Explorer",
    review:
      "Our driver knew every pass and stop. The team checked on us daily via WhatsApp—a premium experience.",
  },
  {
    name: "Neha Verma",
    location: "Mumbai",
    rating: 5,
    trip: "LA Riqueza Manali",
    review:
      "Warm staff, clean rooms and quick help with Solang activities. Will book Uttarakhand next through Travelling Dreams.",
  },
] as const;

export const BLOGS = [
  {
    slug: "best-time-to-visit-spiti",
    title: "Best Time to Visit Spiti Valley",
    excerpt:
      "Compare summer accessibility, monsoon risks and winter closures before you plan your Spiti circuit.",
    coverImage:
      "https://images.unsplash.com/photo-1593691509543-c55fb1088298?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "top-places-in-kashmir",
    title: "Top Places in Kashmir for First-Time Visitors",
    excerpt:
      "Srinagar, Gulmarg and Pahalgam—how many days to spend where, and how to avoid peak-season rush.",
    coverImage:
      "https://images.unsplash.com/photo-1568838358484-4d0d129066d2?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "complete-leh-ladakh-guide",
    title: "Complete Leh Ladakh Guide",
    excerpt:
      "Altitude tips, permit basics, packing list and sample 7-day itinerary for Leh, Nubra and Pangong.",
    coverImage:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "best-honeymoon-destinations-himachal",
    title: "Best Honeymoon Destinations in Himachal",
    excerpt:
      "Manali, Shimla and offbeat Kullu valleys—romantic stays, private cab ideas and season-wise budgets.",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
  },
] as const;
