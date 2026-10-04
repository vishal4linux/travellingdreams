import {
  amenityIdsFromFilter,
  type HotelSearchFilters,
} from "@/lib/hotel-search";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import {
  buildInventoryMapForHotels,
  filterHotelsByStayAvailability,
  stayContextFromFilters,
  type StayContext,
} from "@/services/availability";
import {
  computeStayAvailability,
  getInventoryMap,
  type RoomStayAvailability,
} from "@/services/room-inventory";
import type { Prisma } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import { cache } from "react";

export type { StayContext };

function startingRateFromRooms(
  roomTypes: { baseRate: Decimal; discountedRate: Decimal | null }[]
): number | null {
  if (!roomTypes.length) return null;
  const rates = roomTypes.map(
    (r) => decimalToNumber(r.discountedRate) ?? decimalToNumber(r.baseRate) ?? Infinity
  );
  return Math.min(...rates);
}

export const getHotelFilterMeta = cache(async () => {
  const [destinations, amenities] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.amenity.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  return { destinations, amenities };
});

export async function searchHotels(filters: HotelSearchFilters) {
  const amenityIds = amenityIdsFromFilter(filters.amenities);
  const where: Prisma.HotelWhereInput = {
    isPublished: true,
  };

  if (filters.destination) {
    where.destination = { slug: filters.destination };
  }
  if (filters.stars) {
    where.starRating = { gte: filters.stars };
  }
  if (filters.propertyType) {
    where.propertyType = filters.propertyType;
  }
  if (filters.minRating) {
    where.guestRating = { gte: filters.minRating };
  }
  if (filters.laRiqueza === "1") {
    where.isLaRiqueza = true;
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { city: { contains: filters.q } },
      { state: { contains: filters.q } },
    ];
  }
  if (amenityIds.length) {
    where.AND = amenityIds.map((amenityId) => ({
      amenities: { some: { amenityId } },
    }));
  }

  const roomSome: Prisma.RoomTypeWhereInput = { isPublished: true };
  if (filters.mealPlan) {
    roomSome.mealPlan = filters.mealPlan;
  }
  if (filters.minPrice != null) {
    roomSome.OR = [
      { baseRate: { gte: filters.minPrice } },
      { discountedRate: { gte: filters.minPrice } },
    ];
  }
  where.roomTypes = { some: roomSome };

  const hotels = await prisma.hotel.findMany({
    where,
    include: {
      destination: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      amenities: { include: { amenity: true }, take: 6 },
      roomTypes: {
        where: { isPublished: true },
        orderBy: { baseRate: "asc" },
        select: {
          id: true,
          hotelId: true,
          totalRooms: true,
          maxAdults: true,
          maxChildren: true,
          baseRate: true,
          discountedRate: true,
          mealPlan: true,
        },
      },
    },
  });

  const { ctx: stayContext, error: dateFilterError } = stayContextFromFilters(filters);

  let results = hotels.map((h) => ({
    ...h,
    startingRate: startingRateFromRooms(h.roomTypes),
    amenityNames: h.amenities.map((a) => a.amenity.name),
  }));

  if (stayContext) {
    const inventoryMap = await buildInventoryMapForHotels(results, stayContext.nights);
    results = filterHotelsByStayAvailability(results, stayContext, inventoryMap);
  }

  if (filters.maxPrice != null) {
    results = results.filter(
      (h) => h.startingRate != null && h.startingRate <= filters.maxPrice!
    );
  }

  const sort = filters.sort ?? "featured";
  results.sort((a, b) => {
    if (sort === "price_asc") {
      return (a.startingRate ?? Infinity) - (b.startingRate ?? Infinity);
    }
    if (sort === "price_desc") {
      return (b.startingRate ?? 0) - (a.startingRate ?? 0);
    }
    if (sort === "rating") {
      return (b.guestRating ?? 0) - (a.guestRating ?? 0);
    }
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return (b.guestRating ?? 0) - (a.guestRating ?? 0);
  });

  return {
    hotels: results,
    hasDateFilters: Boolean(stayContext),
    dateFilterError,
    stayContext,
  };
}

export async function getHotelDetailWithAvailability(
  destinationSlug: string,
  hotelSlug: string,
  stayContext: StayContext | null
) {
  const hotel = await getHotelDetail(destinationSlug, hotelSlug);
  if (!hotel || !stayContext) {
    return { hotel, roomAvailability: null as Map<string, RoomStayAvailability> | null };
  }

  const inventoryMap = await getInventoryMap(
    hotel.roomTypes.map((r) => r.id),
    stayContext.nights
  );

  const roomAvailability = new Map<string, RoomStayAvailability>();
  for (const room of hotel.roomTypes) {
    roomAvailability.set(
      room.id,
      computeStayAvailability(
        room.id,
        room.totalRooms,
        room.maxAdults,
        room.maxChildren,
        stayContext.nights,
        inventoryMap,
        stayContext.rooms,
        stayContext.adults,
        stayContext.children
      )
    );
  }

  return { hotel, roomAvailability };
}

export async function getHotelDetail(destinationSlug: string, hotelSlug: string) {
  return prisma.hotel.findFirst({
    where: {
      slug: hotelSlug,
      isPublished: true,
      destination: { slug: destinationSlug },
    },
    include: {
      destination: true,
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      attractions: { orderBy: { name: "asc" } },
      roomTypes: {
        where: { isPublished: true },
        orderBy: { baseRate: "asc" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          amenities: { include: { amenity: true } },
        },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });
}
