import {
  PrismaClient,
  StaffRole,
  MealPlan,
  PropertyType,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  AMENITIES,
  BLOGS,
  DESTINATIONS,
  FEATURED_PACKAGES,
  LA_RIQUEZA_HOTELS,
  OFFERS,
  TESTIMONIALS,
} from "./seed/demo-data";
import { itineraryForPackage } from "./seed/package-itineraries";
import { seedDefaultInventoryForRoomType } from "@/services/room-inventory";

const prisma = new PrismaClient();

async function seedRolesAndAdmin() {
  for (const role of Object.values(StaffRole)) {
    await prisma.role.upsert({
      where: { name: role },
      create: {
        name: role,
        description: `${role.replace("_", " ")} role`,
      },
      update: {},
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: StaffRole.ADMIN },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@travellingdreams.in";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Travelling Dreams Admin",
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
    update: {
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  });
}

async function seedDestinations() {
  const map = new Map<string, string>();

  for (const d of DESTINATIONS) {
    const row = await prisma.destination.upsert({
      where: { slug: d.slug },
      create: {
        name: d.name,
        slug: d.slug,
        state: d.state,
        tagline: d.tagline,
        description: d.description,
        cardImage: d.cardImage,
        heroImage: d.heroImage,
        isPopular: true,
        sortOrder: d.sortOrder,
        metaTitle: `${d.name} Holidays & Hotels | Travelling Dreams`,
        metaDescription: d.tagline,
      },
      update: {
        name: d.name,
        tagline: d.tagline,
        description: d.description,
        cardImage: d.cardImage,
        heroImage: d.heroImage,
        isPopular: true,
        sortOrder: d.sortOrder,
      },
    });
    map.set(d.slug, row.id);
  }

  return map;
}

async function seedAmenities() {
  const map = new Map<string, string>();
  for (const name of AMENITIES) {
    const row = await prisma.amenity.upsert({
      where: { name },
      create: { name },
      update: {},
    });
    map.set(name, row.id);
  }
  return map;
}

async function seedHotels(destinationIds: Map<string, string>, amenityIds: Map<string, string>) {
  const partnerSlugs = LA_RIQUEZA_HOTELS.map((h) => h.slug);
  await prisma.hotel.deleteMany({
    where: {
      isLaRiqueza: true,
      slug: { notIn: partnerSlugs },
    },
  });

  for (const h of LA_RIQUEZA_HOTELS) {
    const destinationId = destinationIds.get(h.destinationSlug);
    if (!destinationId) continue;

    const brandPartner = h.brandPartner ?? "LA Riqueza Hotels";
    const isLaRiqueza = h.isLaRiqueza ?? true;
    const isBookable = !h.openingSoon;

    const hotel = await prisma.hotel.upsert({
      where: { slug: h.slug },
      create: {
        name: h.name,
        slug: h.slug,
        destinationId,
        brandPartner,
        isLaRiqueza,
        isBookable,
        isFeatured: h.isFeatured,
        propertyType: PropertyType.HOTEL,
        starRating: h.starRating,
        address: `${h.city}, ${h.state}`,
        city: h.city,
        state: h.state,
        latitude: h.latitude,
        longitude: h.longitude,
        shortDescription: h.shortDescription,
        description: h.description,
        policies: h.policies,
        guestRating: h.guestRating,
        reviewCount: h.reviewCount,
        metaTitle: `${h.name} | Travelling Dreams`,
        metaDescription: h.shortDescription,
      },
      update: {
        name: h.name,
        brandPartner,
        isLaRiqueza,
        isBookable,
        shortDescription: h.shortDescription,
        description: h.description,
        policies: h.policies,
        latitude: h.latitude,
        longitude: h.longitude,
        isFeatured: h.isFeatured,
        guestRating: h.guestRating,
        reviewCount: h.reviewCount,
        metaDescription: h.shortDescription,
      },
    });

    await prisma.hotelImage.deleteMany({ where: { hotelId: hotel.id } });
    const images = [{ url: h.image, sortOrder: 0, isPrimary: true }];
    if (h.image2) {
      images.push({ url: h.image2, sortOrder: 1, isPrimary: false });
    }
    for (const img of images) {
      await prisma.hotelImage.create({
        data: {
          hotelId: hotel.id,
          url: img.url,
          alt: h.name,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
    }

    await prisma.nearbyAttraction.deleteMany({ where: { hotelId: hotel.id } });
    for (const att of h.attractions) {
      await prisma.nearbyAttraction.create({
        data: {
          hotelId: hotel.id,
          name: att.name,
          distanceKm: att.distanceKm,
          description: att.description,
        },
      });
    }

    await prisma.review.deleteMany({ where: { hotelId: hotel.id } });
    for (const rev of h.reviews) {
      await prisma.review.create({
        data: {
          hotelId: hotel.id,
          rating: rev.rating,
          title: rev.title,
          body: rev.body,
          tripType: rev.tripType,
          isApproved: true,
        },
      });
    }

    await prisma.hotelAmenity.deleteMany({ where: { hotelId: hotel.id } });
    for (const aName of h.amenities) {
      const amenityId = amenityIds.get(aName);
      if (amenityId) {
        await prisma.hotelAmenity.create({
          data: { hotelId: hotel.id, amenityId },
        });
      }
    }

    if (h.openingSoon) {
      await prisma.roomType.deleteMany({ where: { hotelId: hotel.id } });
      continue;
    }

    const roomSlug = "deluxe";
    const roomType = await prisma.roomType.upsert({
      where: { hotelId_slug: { hotelId: hotel.id, slug: roomSlug } },
      create: {
        hotelId: hotel.id,
        name: h.roomName,
        slug: roomSlug,
        description: h.roomDescription,
        maxAdults: 3,
        maxChildren: 2,
        bedType: "King or Twin",
        roomSizeSqm: 28,
        totalRooms: 12,
        baseRate: h.baseRate,
        discountedRate: h.discountedRate,
        mealPlan: MealPlan.BREAKFAST,
      },
      update: {
        name: h.roomName,
        description: h.roomDescription,
        baseRate: h.baseRate,
        discountedRate: h.discountedRate,
      },
    });

    await seedDefaultInventoryForRoomType(roomType.id, roomType.totalRooms);
  }
}

async function seedPackages(destinationIds: Map<string, string>) {
  const activeSlugs = FEATURED_PACKAGES.map((p) => p.slug);
  await prisma.package.updateMany({
    where: { slug: { notIn: activeSlugs } },
    data: { isPublished: false, isFeatured: false },
  });

  for (const p of FEATURED_PACKAGES) {
    const destinationId = destinationIds.get(p.destinationSlug);
    if (!destinationId) continue;

    const primarySlugPath = `${p.destinationSlug}/${p.slug}`;

    const pkg = await prisma.package.upsert({
      where: { slug: p.slug },
      create: {
        title: p.title,
        slug: p.slug,
        primarySlugPath,
        durationNights: p.durationNights,
        durationDays: p.durationDays,
        startingCity: p.startingCity,
        placesCovered: p.placesCovered,
        hotelCategory: p.hotelCategory,
        meals: p.meals,
        transport: p.transport,
        basePrice: p.basePrice,
        theme: p.theme,
        rating: p.rating,
        reviewCount: 40,
        heroImage: p.heroImage,
        highlights: p.highlights,
        description: p.metaDescription ?? p.highlights,
        isFeatured: p.isFeatured ?? true,
        isPublished: true,
        metaTitle: `${p.title} | Travelling Dreams`,
        metaDescription: p.metaDescription ?? p.highlights,
      },
      update: {
        title: p.title,
        basePrice: p.basePrice,
        placesCovered: p.placesCovered,
        startingCity: p.startingCity,
        heroImage: p.heroImage,
        highlights: p.highlights,
        description: p.metaDescription ?? p.highlights,
        isFeatured: p.isFeatured ?? true,
        isPublished: true,
        metaDescription: p.metaDescription ?? p.highlights,
        metaTitle: `${p.title} | Travelling Dreams`,
      },
    });

    await prisma.packageDestination.upsert({
      where: {
        packageId_destinationId: {
          packageId: pkg.id,
          destinationId,
        },
      },
      create: { packageId: pkg.id, destinationId, sortOrder: 0 },
      update: {},
    });

    await prisma.packagePrice.deleteMany({ where: { packageId: pkg.id } });
    await prisma.packagePrice.create({
      data: {
        packageId: pkg.id,
        label: "Standard",
        adultPrice: p.basePrice,
        childPrice: Math.round(p.basePrice * 0.55),
      },
    });

    await prisma.packageItinerary.deleteMany({ where: { packageId: pkg.id } });
    const days = itineraryForPackage(p.slug, {
      startingCity: p.startingCity,
      placesCovered: p.placesCovered,
      durationDays: p.durationDays,
    });
    await prisma.packageItinerary.createMany({
      data: days.map((day) => ({
        packageId: pkg.id,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        meals: day.meals,
        stay: day.stay,
        locationName: day.locationName,
        latitude: day.latitude,
        longitude: day.longitude,
        hotelSlug: day.hotelSlug,
        destinationSlug: day.destinationSlug,
        imageUrl: day.imageUrl,
      })),
    });

    const galleryUrls = [
      p.heroImage,
      ...days.map((d) => d.imageUrl).filter((u): u is string => Boolean(u)),
    ];
    const uniqueGallery = [...new Set(galleryUrls)];
    await prisma.packageImage.deleteMany({ where: { packageId: pkg.id } });
    for (let i = 0; i < uniqueGallery.length; i++) {
      await prisma.packageImage.create({
        data: {
          packageId: pkg.id,
          url: uniqueGallery[i],
          alt: `${p.title} — photo ${i + 1}`,
          sortOrder: i,
        },
      });
    }

    await prisma.packageFaq.deleteMany({ where: { packageId: pkg.id } });
    await prisma.packageFaq.create({
      data: {
        packageId: pkg.id,
        question: "What is included in the package price?",
        answer: `Inclusions typically cover transport (${p.transport}), meals as listed (${p.meals}), and ${p.hotelCategory.replace("_", " ")} hotels. Exact details are shared on voucher.`,
        sortOrder: 0,
      },
    });

    await prisma.package.update({
      where: { id: pkg.id },
      data: {
        inclusions: `Private transport (${p.transport})\nHotel (${p.hotelCategory.replace("_", " ")})\nMeals: ${p.meals}\nSightseeing as per itinerary\nTrip coordinator support`,
        exclusions: "Personal expenses, airfare unless stated, insurance, optional activities, tips",
        cancellationPolicy: "Free cancellation up to 15 days before departure on select packages. Tiered charges apply closer to travel date.",
      },
    });

    await prisma.packageDepartureDate.deleteMany({ where: { packageId: pkg.id } });
    const base = new Date();
    base.setDate(base.getDate() + 14);
    for (let i = 0; i < 3; i++) {
      const start = new Date(base);
      start.setDate(start.getDate() + i * 7);
      await prisma.packageDepartureDate.create({
        data: {
          packageId: pkg.id,
          startDate: start,
          seats: 18,
          booked: 0,
        },
      });
    }
  }
}

async function seedCoupons() {
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    create: {
      code: "WELCOME10",
      description: "10% off your first booking",
      discountType: "PERCENT",
      discountValue: 10,
      minAmount: 5000,
      maxUses: 1000,
      isActive: true,
    },
    update: { isActive: true },
  });
  await prisma.coupon.upsert({
    where: { code: "LARIQUEZA500" },
    create: {
      code: "LARIQUEZA500",
      description: "₹500 off LA Riqueza hotel stays",
      discountType: "FIXED",
      discountValue: 500,
      minAmount: 3000,
      maxUses: 500,
      isActive: true,
    },
    update: { isActive: true },
  });
}

async function seedOffers() {
  for (const [i, o] of OFFERS.entries()) {
    await prisma.offer.upsert({
      where: { slug: o.slug },
      create: {
        title: o.title,
        slug: o.slug,
        description: o.description,
        badge: o.badge,
        sortOrder: i,
        isActive: true,
        linkUrl: "/offers",
      },
      update: {
        title: o.title,
        description: o.description,
        badge: o.badge,
        sortOrder: i,
        isActive: true,
      },
    });
  }
}

async function seedTestimonials() {
  await prisma.testimonial.deleteMany({});
  for (const [i, t] of TESTIMONIALS.entries()) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        location: t.location,
        rating: t.rating,
        trip: t.trip,
        review: t.review,
        sortOrder: i,
        isActive: true,
      },
    });
  }
}

async function seedBlogs() {
  const now = new Date();
  for (const b of BLOGS) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: `${b.excerpt}\n\nFull article content will be managed from the admin panel.`,
        coverImage: b.coverImage,
        author: "Travelling Dreams Team",
        publishedAt: now,
        isPublished: true,
        metaTitle: b.title,
        metaDescription: b.excerpt,
      },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        coverImage: b.coverImage,
        isPublished: true,
      },
    });
  }
}

async function main() {
  console.log("Seeding Travelling Dreams demo data…");
  await seedRolesAndAdmin();
  const destinationIds = await seedDestinations();
  const amenityIds = await seedAmenities();
  await seedHotels(destinationIds, amenityIds);
  await seedPackages(destinationIds);
  await seedOffers();
  await seedCoupons();
  await seedTestimonials();
  await seedBlogs();
  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
