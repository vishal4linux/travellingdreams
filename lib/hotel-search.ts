import type { MealPlan, PropertyType } from "@prisma/client";
import { z } from "zod";

const propertyTypes = [
  "HOTEL",
  "RESORT",
  "BOUTIQUE",
  "HOMESTAY",
  "VILLA",
] as const satisfies readonly PropertyType[];

const mealPlans = [
  "ROOM_ONLY",
  "BREAKFAST",
  "MAP",
  "AP",
  "AI",
] as const satisfies readonly MealPlan[];

export const hotelSearchSchema = z.object({
  destination: z.string().trim().optional(),
  checkIn: z.string().trim().optional(),
  checkOut: z.string().trim().optional(),
  rooms: z.coerce.number().int().min(1).max(8).optional(),
  adults: z.coerce.number().int().min(1).max(12).optional(),
  children: z.coerce.number().int().min(0).max(8).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  stars: z.coerce.number().int().min(1).max(5).optional(),
  propertyType: z.enum(propertyTypes).optional(),
  mealPlan: z.enum(mealPlans).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  amenities: z.string().trim().optional(),
  q: z.string().trim().optional(),
  laRiqueza: z.literal("1").optional(),
  sort: z.enum(["featured", "price_asc", "price_desc", "rating"]).optional(),
});

export type HotelSearchFilters = z.infer<typeof hotelSearchSchema>;

export function parseHotelSearchParams(
  raw: Record<string, string | string[] | undefined>
): HotelSearchFilters {
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  const parsed = hotelSearchSchema.safeParse(flat);
  return parsed.success ? parsed.data : {};
}

export function amenityIdsFromFilter(amenities?: string): string[] {
  if (!amenities) return [];
  return amenities.split(",").map((s) => s.trim()).filter(Boolean);
}

export function filtersToSearchParams(filters: HotelSearchFilters): string {
  const p = new URLSearchParams();
  (Object.entries(filters) as [keyof HotelSearchFilters, unknown][]).forEach(
    ([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        p.set(key, String(value));
      }
    }
  );
  return p.toString();
}
