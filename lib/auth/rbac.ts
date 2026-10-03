import { getAdminSession, type AdminSession } from "@/lib/auth/session";
import type { StaffRole } from "@prisma/client";

const ROLE_ACCESS: Record<string, StaffRole[]> = {
  "/admin": ["ADMIN", "BOOKING_MANAGER", "HOTEL_MANAGER", "CONTENT_MANAGER"],
  "/admin/bookings": ["ADMIN", "BOOKING_MANAGER"],
  "/admin/enquiries": ["ADMIN", "BOOKING_MANAGER"],
  "/admin/hotels": ["ADMIN", "HOTEL_MANAGER"],
  "/admin/packages": ["ADMIN", "CONTENT_MANAGER"],
  "/admin/destinations": ["ADMIN", "CONTENT_MANAGER"],
  "/admin/offers": ["ADMIN", "CONTENT_MANAGER"],
  "/admin/coupons": ["ADMIN", "BOOKING_MANAGER"],
  "/admin/testimonials": ["ADMIN", "CONTENT_MANAGER"],
  "/admin/blogs": ["ADMIN", "CONTENT_MANAGER"],
  "/admin/users": ["ADMIN"],
};

export async function requireAdmin(allowedRoles?: StaffRole[]): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  if (allowedRoles && !allowedRoles.includes(session.role as StaffRole)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function rolesForPath(pathname: string): StaffRole[] | null {
  const match = Object.keys(ROLE_ACCESS)
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return match ? ROLE_ACCESS[match] : null;
}
