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

/** Partner properties — aligned with https://lariquezahotels.com/ */
export const LA_RIQUEZA_HOTELS: SeedHotel[] = [
  {
    slug: "la-riqueza-raunsali-kanatal",
    name: "LA Riqueza Hotel Raunsali – Kanatal",
    destinationSlug: "uttarakhand",
    city: "Kanatal",
    state: "Uttarakhand",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.7,
    reviewCount: 142,
    shortDescription:
      "4-star retreat with views of the Gangotri range and the Himalayas—peace, adventure and comfort near Mussoorie.",
    description:
      "Escape to the tranquil beauty of Kanatal at LA Riqueza Hotel Raunsali, a 4-star retreat offering breathtaking views of the Gangotri Mountains and the majestic Himalayas. Located about 39 km from Gun Hill Point, Mussoorie, and Landour Clock Tower, the hotel is ideal for travelers seeking serenity and mountain air away from crowded hill stations.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nBook direct for best rates and exclusive offers (see partner promotions).\nValid photo ID required for all guests.\nGroup bookings: enquire for savings up to 40% on select dates.\nFlexible booking policies on direct reservations—contact info@lariquezahotels.com.",
    latitude: 30.4199,
    longitude: 78.3436,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Parking", "Mountain View", "Heating", "Travel Desk"],
    roomName: "Himalayan View Deluxe",
    roomDescription: "Comfortable room with mountain-facing views, in-room heating and breakfast on plan.",
    baseRate: 5499,
    discountedRate: 4999,
    attractions: [
      { name: "Mussoorie (Gun Hill)", distanceKm: 39, description: "Classic hill-station day trip." },
      { name: "Landour Clock Tower", distanceKm: 40 },
      { name: "Surkanda Devi Trek", distanceKm: 12 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Kanatal gem",
        body: "Quiet property with stunning Himalayan views—exactly as described on LA Riqueza’s site. Smooth check-in.",
        tripType: "Family",
      },
    ],
  },
  {
    slug: "la-riqueza-dhanolti-view",
    name: "LA Riqueza Hotel Dhanolti View – Dhanolti",
    destinationSlug: "uttarakhand",
    city: "Dhanolti",
    state: "Uttarakhand",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.6,
    reviewCount: 98,
    shortDescription:
      "Nestled in pine forests on the Mussoorie–Chamba route—a serene escape for nature lovers.",
    description:
      "Hotel Dhanolti View sits amidst lush pine forests of Dhanolti, Tehri Garhwal—the perfect retreat for nature lovers and peace seekers. On the scenic Mussoorie–Chamba route, reach us via a picturesque forest road leading to tranquility and natural beauty, away from city bustle.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nBest rate guarantee on direct booking through Travelling Dreams / LA Riqueza channels.\nPriority support for special requests.\nContact: info@lariquezahotels.com · +91 98109 65967.",
    latitude: 30.4246,
    longitude: 78.2397,
    image:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Parking", "Mountain View", "Heating", "Room Service"],
    roomName: "Pine Forest View Room",
    roomDescription: "Warm interiors opening to forest and valley views; ideal for couples and families.",
    baseRate: 4999,
    discountedRate: 4499,
    attractions: [
      { name: "Mussoorie", distanceKm: 24 },
      { name: "Eco Park Dhanolti", distanceKm: 3 },
      { name: "Surkanda Devi", distanceKm: 8 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Forest calm",
        body: "Loved the pine setting and the drive in. Staff were helpful with local sightseeing tips.",
        tripType: "Couple",
      },
    ],
  },
  {
    slug: "la-riqueza-koala-inn-mcleodganj",
    name: "LA Riqueza Hotel Koala Inn Mcleodganj – Dharamshala",
    destinationSlug: "himachal-pradesh",
    city: "McLeod Ganj",
    state: "Himachal Pradesh",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.7,
    reviewCount: 112,
    shortDescription:
      "Boutique comfort in McLeod Ganj with Himalayan views—serenity steps from Dharamshala’s culture and trails.",
    description:
      "Koala Inn offers an exquisite blend of comfort, elegance and breathtaking Himalayan views in McLeod Ganj, Dharamshala. Designed for travelers seeking serenity and adventure, this boutique hotel is a peaceful escape while keeping you close to the region’s vibrant culture and spiritual atmosphere.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nExclusive package offers available on direct booking.\nGovernment taxes as applicable.\nPartner desk: +91 98119 98192.",
    latitude: 32.2423,
    longitude: 76.3236,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1611892440502-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Room Service", "Parking", "Mountain View", "Heating"],
    roomName: "Boutique Superior",
    roomDescription: "Elegant room with mountain outlook; breakfast and in-house dining available.",
    baseRate: 4799,
    discountedRate: 4299,
    attractions: [
      { name: "Dalai Lama Temple Complex", distanceKm: 1.5 },
      { name: "Bhagsu Waterfall", distanceKm: 3 },
      { name: "Triund Trek base", distanceKm: 5 },
    ],
    reviews: [
      {
        rating: 5,
        title: "McLeod Ganj stay",
        body: "Great location for monasteries and cafés. Rooms were clean with lovely hill views.",
        tripType: "Solo",
      },
    ],
  },
  {
    slug: "galleu-hill-resort-kufri",
    name: "LA Riqueza Hotel Galleu Hill Resort – Kufri, Shimla",
    destinationSlug: "himachal-pradesh",
    city: "Kufri",
    state: "Himachal Pradesh",
    starRating: 4,
    isFeatured: true,
    guestRating: 4.5,
    reviewCount: 86,
    shortDescription:
      "Twenty spacious rooms with 180° valley views and in-house Indian & Chinese dining near Shimla.",
    description:
      "Discover serenity in 20 spacious, elegantly designed rooms at Galleu Hill Resort, each offering spectacular 180-degree views of the valley. Savour a delightful culinary journey at the in-house restaurant, with an exquisite selection of Indian and Chinese delicacies—perfect after snow activities or a day exploring Kufri and Shimla.",
    policies:
      "Check-in 2:00 PM · Check-out 11:00 AM\nBook & save with direct reservations—up to 15% off select plans.\nParking available for self-drive guests.\nReservations: info@lariquezahotels.com.",
    latitude: 31.0978,
    longitude: 77.2674,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Free Wi-Fi", "Restaurant", "Parking", "Mountain View", "Heating", "Room Service"],
    roomName: "Valley View Room",
    roomDescription: "Spacious room with panoramic valley windows; ideal for families and winter getaways.",
    baseRate: 5299,
    discountedRate: 4799,
    attractions: [
      { name: "Kufri Fun World", distanceKm: 2 },
      { name: "Himalayan Nature Park", distanceKm: 3 },
      { name: "Shimla Mall Road", distanceKm: 16 },
    ],
    reviews: [
      {
        rating: 5,
        title: "Valley views worth it",
        body: "Restaurant spread was good and the valley view from our room was stunning at sunrise.",
        tripType: "Family",
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
    placesCovered: "Delhi · Kufri · Shimla · McLeod Ganj",
    hotelCategory: "DELUXE",
    meals: "Breakfast",
    transport: "Private tempo traveller or SUV",
    basePrice: 19999,
    rating: 4.6,
    theme: "FAMILY",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    highlights:
      "Family-friendly pacing with LA Riqueza partner stays at Galleu Hill Resort (Kufri) and Koala Inn McLeod Ganj.",
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
    slug: "direct-booking-15",
    title: "Direct Booking Offer",
    badge: "Save 15%",
    description:
      "Book LA Riqueza partner stays directly through Travelling Dreams and enjoy an exclusive 15% discount on select rates.",
  },
  {
    slug: "group-booking-40",
    title: "Group Booking Savings",
    badge: "Up to 40%",
    description: "Save up to 40% on group bookings at LA Riqueza Hotels—Kanatal, Dhanolti, McLeod Ganj and Kufri.",
  },
  {
    slug: "kanatal-dhanaulti-packages",
    title: "Kanatal & Dhanaulti Packages",
    badge: "Uttarakhand",
    description: "Featured mountain packages with partner stays—WhatsApp our team for seasonal deals.",
  },
  {
    slug: "best-rate-guarantee",
    title: "Best Rate Guarantee",
    badge: "LA Riqueza",
    description: "Lowest available rates, flexible policies and priority support when you book official partner hotels with us.",
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
    trip: "LA Riqueza Raunsali Kanatal",
    review:
      "Warm staff, clean rooms and honest mountain views. Will book Dhanolti next through Travelling Dreams.",
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
