import { parseDateOnly, validateStayRange } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { calculateHotelStayPrice } from "@/services/pricing/hotel";
import { computeStayAvailability, getInventoryMap } from "@/services/room-inventory";
import { generateBookingNumber } from "@/services/booking-number";
import { validateAndApplyCoupon } from "@/services/coupons";
import { BookingStatus, BookingType } from "@prisma/client";
import { z } from "zod";

export const hotelBookingInputSchema = z.object({
  destinationSlug: z.string(),
  hotelSlug: z.string(),
  roomSlug: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  rooms: z.coerce.number().int().min(1).max(8),
  adults: z.coerce.number().int().min(1).max(12),
  children: z.coerce.number().int().min(0).max(8),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(20),
  specialRequests: z.string().max(2000).optional(),
  customerId: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function createHotelBooking(input: z.infer<typeof hotelBookingInputSchema>) {
  const stay = validateStayRange(input.checkIn, input.checkOut);
  if (!stay.ok) throw new Error(stay.error ?? "Invalid dates");

  const hotel = await prisma.hotel.findFirst({
    where: {
      slug: input.hotelSlug,
      isPublished: true,
      destination: { slug: input.destinationSlug },
    },
    include: {
      roomTypes: {
        where: { slug: input.roomSlug, isPublished: true },
        take: 1,
      },
    },
  });

  if (!hotel || !hotel.roomTypes[0]) throw new Error("Hotel or room not found");
  const room = hotel.roomTypes[0];

  const inventoryMap = await getInventoryMap([room.id], stay.nights);
  const availability = computeStayAvailability(
    room.id,
    room.totalRooms,
    room.maxAdults,
    room.maxChildren,
    stay.nights,
    inventoryMap,
    input.rooms,
    input.adults,
    input.children
  );
  if (!availability.canBook) throw new Error("Room not available for selected dates");

  let pricing = calculateHotelStayPrice(room, input.checkIn, input.checkOut, input.rooms);
  let couponId: string | undefined;
  let discount = 0;

  if (input.couponCode) {
    const coupon = await validateAndApplyCoupon(input.couponCode, pricing.subtotal);
    couponId = coupon.couponId;
    discount = coupon.discount;
    const subtotal = pricing.subtotal - discount;
    const taxAmount = Math.round(subtotal * (pricing.taxPercent / 100));
    pricing = { ...pricing, subtotal, taxAmount, totalAmount: subtotal + taxAmount };
  }

  const bookingNumber = await generateBookingNumber(BookingType.HOTEL);
  const checkInDate = parseDateOnly(input.checkIn)!;
  const checkOutDate = parseDateOnly(input.checkOut)!;

  const booking = await prisma.$transaction(async (tx) => {
    const parent = await tx.booking.create({
      data: {
        bookingNumber,
        type: BookingType.HOTEL,
        status: BookingStatus.PAYMENT_PENDING,
        subtotal: pricing.subtotal,
        discount,
        taxAmount: pricing.taxAmount,
        totalAmount: pricing.totalAmount,
        couponId,
      },
    });

    await tx.hotelBooking.create({
      data: {
        bookingId: parent.id,
        customerId: input.customerId,
        hotelId: hotel.id,
        roomTypeId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        rooms: input.rooms,
        adults: input.adults,
        children: input.children,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        specialRequests: input.specialRequests,
      },
    });

    await tx.payment.create({
      data: {
        bookingId: parent.id,
        amount: pricing.totalAmount,
        status: "PENDING",
        provider: "razorpay",
      },
    });

    return parent;
  });

  return { booking, pricing, hotel, room, discount };
}
