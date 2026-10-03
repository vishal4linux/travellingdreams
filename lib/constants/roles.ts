import type { StaffRole } from "@prisma/client";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  ADMIN: "Admin",
  HOTEL_MANAGER: "Hotel Manager",
  BOOKING_MANAGER: "Booking Manager",
  CONTENT_MANAGER: "Content Manager",
};

export const STAFF_ROLES: StaffRole[] = [
  "ADMIN",
  "HOTEL_MANAGER",
  "BOOKING_MANAGER",
  "CONTENT_MANAGER",
];
