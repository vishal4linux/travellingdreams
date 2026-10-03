import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/serialize";

export async function validateAndApplyCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase(), isActive: true },
  });
  if (!coupon) throw new Error("Invalid coupon code");

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) throw new Error("Coupon not active yet");
  if (coupon.validUntil && coupon.validUntil < now) throw new Error("Coupon expired");
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Coupon usage limit reached");
  }

  const min = decimalToNumber(coupon.minAmount);
  if (min != null && subtotal < min) {
    throw new Error(`Minimum order amount is ₹${min}`);
  }

  const value = decimalToNumber(coupon.discountValue) ?? 0;
  let discount = 0;
  if (coupon.discountType === "PERCENT") {
    discount = Math.round(subtotal * (value / 100));
  } else {
    discount = value;
  }
  discount = Math.min(discount, subtotal);

  return { couponId: coupon.id, discount, code: coupon.code };
}

export async function incrementCouponUsage(couponId: string, tx: { coupon: { update: typeof prisma.coupon.update } }) {
  await tx.coupon.update({
    where: { id: couponId },
    data: { usedCount: { increment: 1 } },
  });
}
