import { prisma } from "@/lib/prisma";
import type { Decimal } from "@prisma/client/runtime/library";

const emptyStats = {
  todayBookings: 0,
  pendingPayments: 0,
  newEnquiries: 0,
  totalBookings: 0,
  hotelRevenue: null as Decimal | null,
  packageRevenue: null as Decimal | null,
  upcomingArrivals: 0,
  upcomingDepartures: 0,
  popularDestination: "—",
  occupancy: "—",
  dbError: true as const,
};

export async function getAdminDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
  const [
    todayBookings,
    pendingPayments,
    newEnquiries,
    totalBookings,
    hotelRevenue,
    packageRevenue,
    upcomingArrivals,
    upcomingDepartures,
    popularDestination,
  ] = await Promise.all([
    prisma.booking.count({
      where: { createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.booking.count(),
    prisma.payment.aggregate({
      where: { status: "SUCCESSFUL", booking: { type: "HOTEL" } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESSFUL", booking: { type: "PACKAGE" } },
      _sum: { amount: true },
    }),
    prisma.hotelBooking.count({
      where: { checkIn: { gte: today, lte: new Date(Date.now() + 7 * 86400000) } },
    }),
    prisma.hotelBooking.count({
      where: { checkOut: { gte: today, lte: new Date(Date.now() + 7 * 86400000) } },
    }),
    prisma.destination.findFirst({
      where: { isPopular: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true },
    }),
  ]);

  return {
    todayBookings,
    pendingPayments,
    newEnquiries,
    totalBookings,
    hotelRevenue: hotelRevenue._sum.amount,
    packageRevenue: packageRevenue._sum.amount,
    upcomingArrivals,
    upcomingDepartures,
    popularDestination: popularDestination?.name ?? "—",
    occupancy: "—",
    dbError: false as const,
  };
  } catch (err) {
    console.error("admin dashboard stats", err);
    return emptyStats;
  }
}
