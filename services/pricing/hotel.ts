import { countNights } from "@/lib/dates";
import { decimalToNumber } from "@/lib/serialize";

type RoomRateInput = {
  baseRate: unknown;
  discountedRate: unknown | null;
  taxPercent: unknown;
};

export function calculateHotelStayPrice(
  room: RoomRateInput,
  checkIn: string,
  checkOut: string,
  rooms: number
) {
  const nights = countNights(checkIn, checkOut);
  const nightly = decimalToNumber(room.discountedRate) ?? decimalToNumber(room.baseRate) ?? 0;
  const subtotal = nightly * nights * rooms;
  const taxPercent = decimalToNumber(room.taxPercent) ?? 12;
  const taxAmount = Math.round(subtotal * (taxPercent / 100));
  const totalAmount = subtotal + taxAmount;
  return { nights, nightly, subtotal, taxAmount, totalAmount, taxPercent };
}
