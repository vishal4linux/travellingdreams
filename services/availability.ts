import { validateStayRange } from "@/lib/dates";
import type { HotelSearchFilters } from "@/lib/hotel-search";
import {
  computeStayAvailability,
  getInventoryMap,
} from "@/services/room-inventory";

export type StayContext = {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  nights: Date[];
};

export function stayContextFromFilters(
  filters: HotelSearchFilters
): { ctx: StayContext | null; error?: string } {
  if (!filters.checkIn || !filters.checkOut) {
    return { ctx: null };
  }
  const validation = validateStayRange(filters.checkIn, filters.checkOut);
  if (!validation.ok) {
    return { ctx: null, error: validation.error };
  }
  return {
    ctx: {
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      rooms: filters.rooms ?? 1,
      adults: filters.adults ?? 2,
      children: filters.children ?? 0,
      nights: validation.nights,
    },
  };
}

type RoomTypeRow = {
  id: string;
  hotelId: string;
  totalRooms: number;
  maxAdults: number;
  maxChildren: number;
};

type InventoryMap = Map<
  string,
  Map<string, { available: number; isBlocked: boolean }>
>;

export function filterHotelsByStayAvailability<
  T extends { id: string; roomTypes: RoomTypeRow[] }
>(hotels: T[], ctx: StayContext, inventoryMap: InventoryMap): T[] {
  return hotels.filter((hotel) => {
    return hotel.roomTypes.some((rt) => {
      const stay = computeStayAvailability(
        rt.id,
        rt.totalRooms,
        rt.maxAdults,
        rt.maxChildren,
        ctx.nights,
        inventoryMap,
        ctx.rooms,
        ctx.adults,
        ctx.children
      );
      return stay.canBook;
    });
  });
}

export async function buildInventoryMapForHotels(
  hotels: { roomTypes: { id: string }[] }[],
  nights: Date[]
) {
  const ids = hotels.flatMap((h) => h.roomTypes.map((r) => r.id));
  return getInventoryMap(ids, nights);
}

export function availabilityForRoom(
  roomType: {
    id: string;
    totalRooms: number;
    maxAdults: number;
    maxChildren: number;
  },
  ctx: StayContext,
  inventoryMap: Awaited<ReturnType<typeof getInventoryMap>>
) {
  return computeStayAvailability(
    roomType.id,
    roomType.totalRooms,
    roomType.maxAdults,
    roomType.maxChildren,
    ctx.nights,
    inventoryMap,
    ctx.rooms,
    ctx.adults,
    ctx.children
  );
}
