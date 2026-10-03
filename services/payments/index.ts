import { mockPaymentProvider } from "./mock-provider";
import { razorpayProvider } from "./razorpay-provider";
import type { PaymentProvider } from "./types";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";
import { decrementInventoryForStay } from "@/services/room-inventory";
import { eachNight } from "@/lib/dates";

export function getPaymentProvider(): PaymentProvider {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return razorpayProvider;
  }
  return mockPaymentProvider;
}

export async function getBookingPaymentBalance(bookingNumber: string) {
  const booking = await prisma.booking.findUnique({
    where: { bookingNumber },
    include: {
      payments: { where: { status: "SUCCESSFUL" } },
      hotelBooking: true,
      packageBooking: true,
    },
  });
  if (!booking) return null;
  const total = decimalToNumber(booking.totalAmount) ?? 0;
  const paid = booking.payments.reduce(
    (s, p) => s + (decimalToNumber(p.amount) ?? 0),
    0
  );
  return { total, paid, remaining: Math.max(0, total - paid), booking };
}

async function finalizePaidBooking(bookingId: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: {
        hotelBooking: true,
        packageBooking: true,
      },
    });

    if (booking.status === "PAID" || booking.status === "CONFIRMED") return booking;

    if (booking.type === "HOTEL" && booking.hotelBooking) {
      const hb = booking.hotelBooking;
      const nights = eachNight(hb.checkIn, hb.checkOut);
      await decrementInventoryForStay(tx, hb.roomTypeId, nights, hb.rooms);
    }

    if (booking.type === "PACKAGE" && booking.packageBooking?.departureDateId) {
      const dep = await tx.packageDepartureDate.findUnique({
        where: { id: booking.packageBooking.departureDateId },
      });
      if (dep) {
        const seats = booking.packageBooking.adults + booking.packageBooking.children;
        if (dep.booked + seats > dep.seats) throw new Error("Departure date sold out");
        await tx.packageDepartureDate.update({
          where: { id: dep.id },
          data: { booked: { increment: seats } },
        });
      }
    }

    if (booking.couponId) {
      await tx.coupon.update({
        where: { id: booking.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return tx.booking.update({
      where: { id: booking.id },
      data: { status: "PAID" },
    });
  });
}

export async function completeBookingPayment(
  bookingNumber: string,
  providerPaymentId?: string,
  options?: { amount?: number; isAdvance?: boolean }
) {
  const balance = await getBookingPaymentBalance(bookingNumber);
  if (!balance) throw new Error("Booking not found");

  const { booking, total, paid, remaining } = balance;
  if (booking.status === "PAID" || booking.status === "CONFIRMED") return booking;

  const payAmount = options?.amount ?? remaining;
  if (payAmount <= 0) throw new Error("Nothing to pay");
  if (payAmount > remaining + 0.01) throw new Error("Amount exceeds balance");

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: payAmount,
        status: "SUCCESSFUL",
        providerPaymentId: providerPaymentId ?? `manual_${Date.now()}`,
        paidAt: new Date(),
        method: "RAZORPAY",
        isAdvance: options?.isAdvance ?? payAmount < remaining,
      },
    });

    await tx.payment.updateMany({
      where: { bookingId: booking.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
  });

  const newPaid = paid + payAmount;
  if (newPaid >= total - 0.01) {
    return finalizePaidBooking(booking.id);
  }

  return prisma.booking.update({
    where: { id: booking.id },
    data: { status: "PAYMENT_PENDING" },
  });
}
