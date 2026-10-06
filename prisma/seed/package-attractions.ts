export type SeedAttraction = {
  packageSlug: string;
  dayNumber?: number;
  name: string;
  tagline?: string;
  description?: string;
  whyVisit?: string;
  category: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  sortOrder?: number;
};

export const PACKAGE_ATTRACTIONS: SeedAttraction[] = [
  // Kanatal Raunsali
  {
    packageSlug: "kanatal-la-riqueza-raunsali-escape",
    dayNumber: 2,
    name: "Gun Hill Point",
    tagline: "Mussoorie’s iconic cable-car viewpoint",
    whyVisit: "Sweeping Doon Valley views — classic first-timer Mussoorie stop.",
    category: "viewpoint",
    latitude: 30.4591,
    longitude: 78.0707,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "kanatal-la-riqueza-raunsali-escape",
    dayNumber: 2,
    name: "Landour Clock Tower",
    tagline: "Colonial charm & café lanes",
    whyVisit: "Quiet heritage walks, bakeries and soft mountain light for photos.",
    category: "culture",
    latitude: 30.4555,
    longitude: 78.0965,
    imageUrl:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    packageSlug: "kanatal-la-riqueza-raunsali-escape",
    dayNumber: 3,
    name: "Surkanda Devi Temple",
    tagline: "Hilltop shrine above the clouds",
    whyVisit: "Short trek or drive — panoramic Himalayan ridge views and local devotion.",
    category: "famous",
    latitude: 30.492,
    longitude: 78.38,
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    sortOrder: 3,
  },
  // Dharamshala
  {
    packageSlug: "dharamshala-mcleodganj-retreat",
    dayNumber: 2,
    name: "Dalai Lama Temple Complex",
    tagline: "Tsuglagkhang — spiritual heart of McLeod Ganj",
    whyVisit: "Monastery atmosphere, prayer wheels and Tibetan culture at walking distance.",
    category: "famous",
    latitude: 32.2363,
    longitude: 76.3241,
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "dharamshala-mcleodganj-retreat",
    dayNumber: 2,
    name: "Bhagsu Waterfall",
    tagline: "Easy trail + café culture",
    whyVisit: "Short hike to the falls; great for families and golden-hour photos.",
    category: "nature",
    latitude: 32.2503,
    longitude: 76.3276,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    packageSlug: "dharamshala-mcleodganj-retreat",
    dayNumber: 3,
    name: "Triund Trek Base",
    tagline: "Gateway to Dhauladhar ridges",
    whyVisit: "Optional short trek start — views that define Himachal adventure trips.",
    category: "adventure",
    latitude: 32.246,
    longitude: 76.312,
    imageUrl:
      "https://images.unsplash.com/photo-1611892440502-42a792e24d32?q=80&w=800&auto=format&fit=crop",
    sortOrder: 3,
  },
  // Shimla Kufri
  {
    packageSlug: "shimla-kufri-weekend",
    dayNumber: 2,
    name: "Kufri Fun World",
    tagline: "Snow play & pony rides",
    whyVisit: "Winter snow activities and family fun close to Galleu Hill Resort.",
    category: "adventure",
    latitude: 31.097,
    longitude: 77.267,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "shimla-kufri-weekend",
    dayNumber: 2,
    name: "The Ridge & Mall Road",
    tagline: "Shimla’s social heart",
    whyVisit: "Colonial architecture, Christ Church and evening walks.",
    category: "famous",
    latitude: 31.1046,
    longitude: 77.1734,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  // Rishikesh Kanatal
  {
    packageSlug: "rishikesh-kanatal-spiritual-hills",
    dayNumber: 2,
    name: "Triveni Ghat Aarti",
    tagline: "Evening Ganga aarti",
    whyVisit: "Spiritual highlight of Rishikesh — lamps, chants and river energy.",
    category: "culture",
    latitude: 30.1034,
    longitude: 78.3108,
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "rishikesh-kanatal-spiritual-hills",
    dayNumber: 2,
    name: "Laxman Jhula area",
    tagline: "Suspension bridge & cafés",
    whyVisit: "Classic Rishikesh photo stop with riverside cafés and temples.",
    category: "famous",
    latitude: 30.1258,
    longitude: 78.3297,
    imageUrl:
      "https://images.unsplash.com/photo-1586500036706-34d271c8a96e?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    packageSlug: "rishikesh-kanatal-spiritual-hills",
    dayNumber: 3,
    name: "Kanatal Himalayan Views",
    tagline: "Quiet hill escape",
    whyVisit: "LA Riqueza Raunsali base — Gangotri range sunsets away from crowds.",
    category: "viewpoint",
    latitude: 30.4199,
    longitude: 78.3436,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    sortOrder: 3,
  },
  // Manali
  {
    packageSlug: "manali-solang-adventure",
    dayNumber: 2,
    name: "Solang Valley",
    tagline: "Adventure playground",
    whyVisit: "Paragliding, zorbing and snow slopes — Manali’s most booked activity zone.",
    category: "adventure",
    latitude: 32.316,
    longitude: 77.157,
    imageUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3c7a14745?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "manali-solang-adventure",
    dayNumber: 2,
    name: "Hadimba Temple",
    tagline: "Cedar forest shrine",
    whyVisit: "Iconic wooden temple in pine forest — essential Manali cultural stop.",
    category: "culture",
    latitude: 32.247,
    longitude: 77.181,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    packageSlug: "manali-solang-adventure",
    dayNumber: 3,
    name: "Old Manali Café Trail",
    tagline: "River & café vibe",
    whyVisit: "Relaxed evening walks, live music cafés and Beas riverside photos.",
    category: "food",
    latitude: 32.253,
    longitude: 77.178,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    sortOrder: 3,
  },
  // Kashmir
  {
    packageSlug: "kashmir-paradise",
    dayNumber: 1,
    name: "Dal Lake Shikara",
    tagline: "Srinagar’s signature ride",
    whyVisit: "Floating gardens, houseboats and Kashmir’s most photographed experience.",
    category: "famous",
    latitude: 34.116,
    longitude: 74.87,
    imageUrl:
      "https://images.unsplash.com/photo-1595819218636-72a394875a46?q=80&w=800&auto=format&fit=crop",
    sortOrder: 1,
  },
  {
    packageSlug: "kashmir-paradise",
    dayNumber: 2,
    name: "Gulmarg Gondola",
    tagline: "Meadows above the clouds",
    whyVisit: "Asia’s highest cable car — snow in winter, flowers in summer.",
    category: "adventure",
    latitude: 34.048,
    longitude: 74.38,
    imageUrl:
      "https://images.unsplash.com/photo-1568838358484-4d0d129066d2?q=80&w=800&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    packageSlug: "kashmir-paradise",
    dayNumber: 3,
    name: "Pahalgam Betaab Valley",
    tagline: "Lidder river meadows",
    whyVisit: "Film locations, pine forests and perfect family picnic landscapes.",
    category: "nature",
    latitude: 34.01,
    longitude: 75.19,
    imageUrl:
      "https://images.unsplash.com/photo-1595819218636-72a394875a46?q=80&w=800&auto=format&fit=crop",
    sortOrder: 3,
  },
];
