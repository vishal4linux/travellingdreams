import { validateStayRange } from "@/lib/dates";
import { getHotelRoomAvailability } from "@/services/room-inventory";
import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  hotelId: z.string().min(1),
  checkIn: z.string(),
  checkOut: z.string(),
  rooms: z.coerce.number().int().min(1).max(8).default(1),
  adults: z.coerce.number().int().min(1).max(12).default(2),
  children: z.coerce.number().int().min(0).max(8).default(0),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { hotelId, checkIn, checkOut, rooms, adults, children } = parsed.data;
  const stay = validateStayRange(checkIn, checkOut);
  if (!stay.ok) {
    return NextResponse.json({ error: stay.error }, { status: 400 });
  }

  const availability = await getHotelRoomAvailability(
    hotelId,
    stay.nights,
    rooms,
    adults,
    children
  );

  return NextResponse.json({
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
    roomTypes: availability.map((a) => ({
      roomTypeId: a.roomTypeId,
      minAvailable: a.minAvailable,
      canBook: a.canBook,
      fitsGuests: a.fitsGuests,
    })),
  });
}
