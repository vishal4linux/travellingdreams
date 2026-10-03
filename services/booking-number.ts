import { prisma } from "@/lib/prisma";
import {
  HOTEL_BOOKING_PREFIX,
  PACKAGE_BOOKING_PREFIX,
} from "@/types/booking";
import type { BookingType } from "@prisma/client";

export async function generateBookingNumber(
  type: BookingType
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix =
    type === "HOTEL" ? HOTEL_BOOKING_PREFIX : PACKAGE_BOOKING_PREFIX;
  const key = `booking_seq_${type.toLowerCase()}_${year}`;

  const seq = await prisma.$transaction(async (tx) => {
    const row = await tx.siteSetting.findUnique({ where: { key } });
    const next = row ? parseInt(row.value, 10) + 1 : 1;
    await tx.siteSetting.upsert({
      where: { key },
      create: { key, value: String(next) },
      update: { value: String(next) },
    });
    return next;
  });

  return `${prefix}-${year}-${String(seq).padStart(6, "0")}`;
}
