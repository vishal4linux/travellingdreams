import { parseDateOnly } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { calculatePackagePrice, pickSeasonalPrice } from "@/services/pricing/package";
import { generateBookingNumber } from "@/services/booking-number";
import { validateAndApplyCoupon } from "@/services/coupons";
import { BookingStatus, BookingType } from "@prisma/client";
import { z } from "zod";

const addOnSchema = z.array(
  z.object({ name: z.string(), price: z.coerce.number().min(0) })
).optional();

export const packageBookingInputSchema = z.object({
  destinationSlug: z.string(),
  packageSlug: z.string(),
  travelDate: z.string(),
  departureDateId: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(12),
  children: z.coerce.number().int().min(0).max(8),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(8).max(20),
  specialRequests: z.string().max(2000).optional(),
  customerId: z.string().optional(),
  couponCode: z.string().optional(),
  addOns: addOnSchema,
});

export async function createPackageBooking(input: z.infer<typeof packageBookingInputSchema>) {
  const travelDate = parseDateOnly(input.travelDate);
  if (!travelDate) throw new Error("Invalid travel date");

  const pkg = await prisma.package.findFirst({
    where: {
      slug: input.packageSlug,
      isPublished: true,
      destinations: { some: { destination: { slug: input.destinationSlug } } },
    },
    include: { prices: { orderBy: { adultPrice: "asc" } } },
  });
  if (!pkg) throw new Error("Package not found");

  if (input.departureDateId) {
    const dep = await prisma.packageDepartureDate.findFirst({
      where: { id: input.departureDateId, packageId: pkg.id },
    });
    if (!dep) throw new Error("Invalid departure date");
    const seatsNeeded = input.adults + input.children;
    if (dep.booked + seatsNeeded > dep.seats) throw new Error("Departure date is sold out");
  }

  const priceRow = pickSeasonalPrice(pkg.prices, travelDate);
  const addOnTotal =
    input.addOns?.reduce((s, a) => s + a.price, 0) ?? 0;

  let pricing = calculatePackagePrice(
    pkg.basePrice,
    priceRow?.adultPrice ?? null,
    priceRow?.childPrice ?? null,
    input.adults,
    input.children,
    addOnTotal
  );

  let couponId: string | undefined;
  let discount = 0;
  if (input.couponCode) {
    const coupon = await validateAndApplyCoupon(input.couponCode, pricing.subtotal);
    couponId = coupon.couponId;
    discount = coupon.discount;
    const subtotal = pricing.subtotal - discount;
    const taxAmount = Math.round(subtotal * 0.05);
    pricing = { ...pricing, subtotal, taxAmount, totalAmount: subtotal + taxAmount };
  }

  const bookingNumber = await generateBookingNumber(BookingType.PACKAGE);

  const booking = await prisma.$transaction(async (tx) => {
    const parent = await tx.booking.create({
      data: {
        bookingNumber,
        type: BookingType.PACKAGE,
        status: BookingStatus.PAYMENT_PENDING,
        subtotal: pricing.subtotal,
        discount,
        taxAmount: pricing.taxAmount,
        totalAmount: pricing.totalAmount,
        couponId,
      },
    });

    await tx.packageBooking.create({
      data: {
        bookingId: parent.id,
        customerId: input.customerId,
        packageId: pkg.id,
        departureDateId: input.departureDateId,
        travelDate,
        adults: input.adults,
        children: input.children,
        addOns: input.addOns ?? undefined,
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

  return { booking, pricing, pkg, discount };
}
