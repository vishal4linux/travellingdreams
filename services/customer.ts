import { prisma } from "@/lib/prisma";

export async function getCustomerBookings(customerId: string) {
  return prisma.booking.findMany({
    where: {
      OR: [
        { hotelBooking: { customerId } },
        { packageBooking: { customerId } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      hotelBooking: { include: { hotel: true } },
      packageBooking: { include: { package: true } },
      payments: { take: 1, orderBy: { createdAt: "desc" } },
    },
  });
}
