import type { MealPlan, PropertyType } from "@prisma/client";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOTEL: "Hotel",
  RESORT: "Resort",
  BOUTIQUE: "Boutique",
  HOMESTAY: "Homestay",
  VILLA: "Villa",
};

export const MEAL_PLAN_LABELS: Record<MealPlan, string> = {
  ROOM_ONLY: "Room only",
  BREAKFAST: "Breakfast included",
  MAP: "Breakfast & dinner (MAP)",
  AP: "Breakfast, lunch & dinner (AP)",
  AI: "All inclusive",
};

export function hotelDetailPath(destinationSlug: string, hotelSlug: string) {
  return `/hotels/${destinationSlug}/${hotelSlug}`;
}

export function hotelBookQuery(params: {
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  room?: string;
}) {
  const q = new URLSearchParams();
  if (params.checkIn) q.set("checkIn", params.checkIn);
  if (params.checkOut) q.set("checkOut", params.checkOut);
  if (params.rooms) q.set("rooms", String(params.rooms));
  if (params.adults) q.set("adults", String(params.adults));
  if (params.children) q.set("children", String(params.children));
  if (params.room) q.set("room", params.room);
  const s = q.toString();
  return s ? `?${s}` : "";
}
