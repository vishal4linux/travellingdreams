import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPopularDestinations = cache(async () => {
  return prisma.destination.findMany({
    where: { isPublished: true, isPopular: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      cardImage: true,
      state: true,
    },
  });
});

export const getAllDestinations = cache(async () => {
  return prisma.destination.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      cardImage: true,
      state: true,
      description: true,
    },
  });
});

export const getDestinationBySlug = cache(async (slug: string) => {
  return prisma.destination.findFirst({
    where: { slug, isPublished: true },
    include: {
      hotels: {
        where: { isPublished: true },
        take: 6,
        select: {
          name: true,
          slug: true,
          city: true,
          starRating: true,
          isLaRiqueza: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
      packageDestinations: {
        take: 6,
        include: {
          package: {
            select: {
              title: true,
              slug: true,
              durationNights: true,
              durationDays: true,
              basePrice: true,
              heroImage: true,
              isPublished: true,
            },
          },
        },
      },
    },
  });
});

export const getDestinationSlugs = cache(async () => {
  return prisma.destination.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
});
