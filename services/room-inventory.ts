import { formatDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type NightAvailability = {
  date: Date;
  available: number;
  isBlocked: boolean;
};

export type RoomStayAvailability = {
  roomTypeId: string;
  minAvailable: number;
  nightly: NightAvailability[];
  fitsGuests: boolean;
  canBook: boolean;
};

function fitsGuestCapacity(
  rooms: number,
  adults: number,
  children: number,
  maxAdults: number,
  maxChildren: number
): boolean {
  return rooms * maxAdults >= adults && rooms * maxChildren >= children;
}

export async function getInventoryMap(
  roomTypeIds: string[],
  nights: Date[]
): Promise<Map<string, Map<string, { available: number; isBlocked: boolean }>>> {
  const result = new Map<string, Map<string, { available: number; isBlocked: boolean }>>();
  if (!roomTypeIds.length || !nights.length) return result;

  const rows = await prisma.roomInventory.findMany({
    where: {
      roomTypeId: { in: roomTypeIds },
      date: { in: nights },
    },
  });

  for (const row of rows) {
    const key = formatDateOnly(row.date);
    if (!result.has(row.roomTypeId)) {
      result.set(row.roomTypeId, new Map());
    }
    result.get(row.roomTypeId)!.set(key, {
      available: row.available,
      isBlocked: row.isBlocked,
    });
  }
  return result;
}

export function computeStayAvailability(
  roomTypeId: string,
  totalRooms: number,
  maxAdults: number,
  maxChildren: number,
  nights: Date[],
  inventoryMap: Map<string, Map<string, { available: number; isBlocked: boolean }>>,
  roomsRequested: number,
  adults: number,
  children: number
): RoomStayAvailability {
  const perDate = inventoryMap.get(roomTypeId);
  let minAvailable = Infinity;
  const nightly: NightAvailability[] = nights.map((date) => {
    const key = formatDateOnly(date);
    const row = perDate?.get(key);
    let available = totalRooms;
    let isBlocked = false;
    if (row) {
      isBlocked = row.isBlocked;
      available = row.isBlocked ? 0 : row.available;
    }
    minAvailable = Math.min(minAvailable, available);
    return { date, available, isBlocked };
  });

  if (minAvailable === Infinity) minAvailable = 0;

  const fitsGuests = fitsGuestCapacity(
    roomsRequested,
    adults,
    children,
    maxAdults,
    maxChildren
  );
  const canBook = fitsGuests && minAvailable >= roomsRequested;

  return {
    roomTypeId,
    minAvailable,
    nightly,
    fitsGuests,
    canBook,
  };
}

export async function getHotelRoomAvailability(
  hotelId: string,
  nights: Date[],
  roomsRequested: number,
  adults: number,
  children: number
) {
  const roomTypes = await prisma.roomType.findMany({
    where: { hotelId, isPublished: true },
    select: {
      id: true,
      totalRooms: true,
      maxAdults: true,
      maxChildren: true,
    },
  });

  const inventoryMap = await getInventoryMap(
    roomTypes.map((r) => r.id),
    nights
  );

  return roomTypes.map((rt) =>
    computeStayAvailability(
      rt.id,
      rt.totalRooms,
      rt.maxAdults,
      rt.maxChildren,
      nights,
      inventoryMap,
      roomsRequested,
      adults,
      children
    )
  );
}

export async function hotelHasAvailability(
  hotelId: string,
  nights: Date[],
  roomsRequested: number,
  adults: number,
  children: number
): Promise<boolean> {
  const avail = await getHotelRoomAvailability(
    hotelId,
    nights,
    roomsRequested,
    adults,
    children
  );
  return avail.some((a) => a.canBook);
}

/** Phase 5: call inside a booking transaction to prevent overbooking. */
export async function decrementInventoryForStay(
  tx: Prisma.TransactionClient,
  roomTypeId: string,
  nights: Date[],
  rooms: number
) {
  const roomType = await tx.roomType.findUniqueOrThrow({
    where: { id: roomTypeId },
    select: { totalRooms: true },
  });

  for (const night of nights) {
    const existing = await tx.roomInventory.findUnique({
      where: { roomTypeId_date: { roomTypeId, date: night } },
    });

    if (!existing) {
      if (roomType.totalRooms < rooms) {
        throw new Error("INSUFFICIENT_INVENTORY");
      }
      await tx.roomInventory.create({
        data: {
          roomTypeId,
          date: night,
          available: roomType.totalRooms - rooms,
        },
      });
      continue;
    }

    if (existing.isBlocked || existing.available < rooms) {
      throw new Error("INSUFFICIENT_INVENTORY");
    }

    const updated = await tx.roomInventory.updateMany({
      where: {
        roomTypeId,
        date: night,
        isBlocked: false,
        available: { gte: rooms },
      },
      data: { available: { decrement: rooms } },
    });

    if (updated.count !== 1) {
      throw new Error("INSUFFICIENT_INVENTORY");
    }
  }
}

export async function seedDefaultInventoryForRoomType(
  roomTypeId: string,
  totalRooms: number,
  daysAhead = 120
) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const rows: { roomTypeId: string; date: Date; available: number }[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    let available = totalRooms;
    const dow = date.getUTCDay();
    if (dow === 5 || dow === 6) {
      available = Math.max(1, totalRooms - 2);
    }
    rows.push({ roomTypeId, date, available });
  }

  for (const row of rows) {
    await prisma.roomInventory.upsert({
      where: {
        roomTypeId_date: { roomTypeId: row.roomTypeId, date: row.date },
      },
      create: row,
      update: { available: row.available, isBlocked: false },
    });
  }
}
