import { parsePackageSearchParams, type PackageSearchFilters } from "@/lib/package-search";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { cache } from "react";

export { parsePackageSearchParams, type PackageSearchFilters };

export const getPackageFilterMeta = cache(async () => {
  const destinations = await prisma.destination.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });
  return { destinations };
});

export async function searchPackages(filters: PackageSearchFilters) {
  const where: Prisma.PackageWhereInput = { isPublished: true };

  if (filters.destination) {
    where.destinations = { some: { destination: { slug: filters.destination } } };
  }
  if (filters.duration) {
    where.durationNights = { lte: filters.duration };
  }
  if (filters.theme) {
    where.theme = filters.theme as Prisma.EnumPackageThemeFilter;
  }
  if (filters.departure) {
    where.startingCity = { contains: filters.departure };
  }
  if (filters.hotelCategory) {
    where.hotelCategory = filters.hotelCategory as Prisma.EnumHotelCategoryFilter;
  }
  if (filters.budget) {
    where.basePrice = { lte: filters.budget };
  }
  if (filters.q) {
    const q = filters.q.trim();
    if (q.length >= 2) {
      const textMatch: Prisma.PackageWhereInput = {
        OR: [
          { title: { contains: q } },
          { placesCovered: { contains: q } },
          { highlights: { contains: q } },
          { description: { contains: q } },
          { metaDescription: { contains: q } },
          { startingCity: { contains: q } },
        ],
      };
      const existingAnd = where.AND
        ? Array.isArray(where.AND)
          ? where.AND
          : [where.AND]
        : [];
      where.AND = [...existingAnd, textMatch];
    }
  }

  return prisma.package.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { basePrice: "asc" }],
    include: {
      destinations: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        include: { destination: { select: { name: true, slug: true } } },
      },
    },
  });
}

export async function getPackageDetail(destinationSlug: string, packageSlug: string) {
  return prisma.package.findFirst({
    where: {
      slug: packageSlug,
      isPublished: true,
      destinations: { some: { destination: { slug: destinationSlug } } },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      destinations: { include: { destination: true }, orderBy: { sortOrder: "asc" } },
      itinerary: { orderBy: { dayNumber: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
      dates: { where: { startDate: { gte: new Date() } }, orderBy: { startDate: "asc" }, take: 12 },
      prices: { orderBy: { adultPrice: "asc" }, take: 1 },
    },
  });
}

export async function getBookingByNumber(bookingNumber: string, customerId?: string) {
  return prisma.booking.findFirst({
    where: {
      bookingNumber,
      ...(customerId
        ? {
            OR: [
              { hotelBooking: { customerId } },
              { packageBooking: { customerId } },
            ],
          }
        : {}),
    },
    include: {
      hotelBooking: {
        include: {
          hotel: { include: { destination: true, images: { take: 1 } } },
          roomType: true,
        },
      },
      packageBooking: { include: { package: { include: { destinations: { include: { destination: true } } } } } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
}
