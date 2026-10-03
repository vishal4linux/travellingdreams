import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getLaRiquezaHotels = cache(async (limit = 4) => {
  const hotels = await prisma.hotel.findMany({
    where: { isPublished: true, isLaRiqueza: true },
    orderBy: [{ isFeatured: "desc" }, { guestRating: "desc" }],
    take: limit,
    include: {
      destination: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      amenities: { include: { amenity: true }, take: 5 },
      roomTypes: {
        where: { isPublished: true },
        orderBy: { baseRate: "asc" },
        take: 1,
        select: { baseRate: true, discountedRate: true, mealPlan: true },
      },
    },
  });

  return hotels.map((h) => ({
    ...h,
    startingRate: h.roomTypes[0]?.discountedRate ?? h.roomTypes[0]?.baseRate ?? null,
    mealPlan: h.roomTypes[0]?.mealPlan ?? null,
    amenityNames: h.amenities.map((a) => a.amenity.name),
  }));
});

export const getFeaturedPackages = cache(async (limit = 6) => {
  return prisma.package.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      destinations: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        include: { destination: { select: { name: true, slug: true } } },
      },
    },
  });
});

export const getActiveOffers = cache(async (limit = 4) => {
  const now = new Date();
  return prisma.offer.findMany({
    where: {
      isActive: true,
      OR: [
        { validFrom: null, validUntil: null },
        { validFrom: { lte: now }, validUntil: null },
        { validFrom: null, validUntil: { gte: now } },
        { validFrom: { lte: now }, validUntil: { gte: now } },
      ],
    },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
});

export const getPublishedBlogs = cache(async (limit = 4) => {
  return prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });
});

export const getActiveTestimonials = cache(async (limit = 6) => {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
});

export const getSearchDestinations = cache(async () => {
  return prisma.destination.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });
});
