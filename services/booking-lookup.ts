import { prisma } from "@/lib/prisma";

export async function lookupBookingForGuest(bookingNumber: string, email: string) {
  return prisma.booking.findFirst({
    where: {
      bookingNumber,
      OR: [
        { hotelBooking: { guestEmail: email } },
        { packageBooking: { guestEmail: email } },
      ],
    },
    include: {
      hotelBooking: { include: { hotel: true, roomType: true } },
      packageBooking: { include: { package: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
}
