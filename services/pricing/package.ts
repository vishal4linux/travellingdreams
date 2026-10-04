import { decimalToNumber } from "@/lib/serialize";
import type { PackagePrice } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export function calculatePackagePrice(
  basePrice: Decimal,
  adultPrice: Decimal | null,
  childPrice: Decimal | null,
  adults: number,
  children: number,
  addOnTotal = 0
) {
  const adult = decimalToNumber(adultPrice) ?? decimalToNumber(basePrice) ?? 0;
  const child = decimalToNumber(childPrice) ?? adult * 0.6;
  const subtotal = adult * adults + child * children + addOnTotal;
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxAmount;
  return { subtotal, taxAmount, totalAmount, adult, child };
}

export function pickSeasonalPrice(prices: PackagePrice[], travelDate: Date) {
  const match = prices.find((p) => {
    if (!p.seasonStart || !p.seasonEnd) return false;
    return travelDate >= p.seasonStart && travelDate <= p.seasonEnd;
  });
  return match ?? prices[0] ?? null;
}
