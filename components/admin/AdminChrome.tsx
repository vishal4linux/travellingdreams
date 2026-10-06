"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; roles?: string[] }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings", roles: ["ADMIN", "BOOKING_MANAGER"] },
  { href: "/admin/enquiries", label: "Enquiries", roles: ["ADMIN", "BOOKING_MANAGER"] },
  { href: "/admin/destinations", label: "Destinations", roles: ["ADMIN", "CONTENT_MANAGER"] },
  { href: "/admin/hotels", label: "Hotels", roles: ["ADMIN", "HOTEL_MANAGER"] },
  { href: "/admin/packages", label: "Packages", roles: ["ADMIN", "CONTENT_MANAGER"] },
  { href: "/admin/offers", label: "Offers", roles: ["ADMIN", "CONTENT_MANAGER"] },
  { href: "/admin/media", label: "Media", roles: ["ADMIN", "CONTENT_MANAGER", "HOTEL_MANAGER"] },
  { href: "/admin/settings", label: "Website content", roles: ["ADMIN", "CONTENT_MANAGER"] },
  { href: "/admin/coupons", label: "Coupons", roles: ["ADMIN", "BOOKING_MANAGER"] },
];

export function AdminChrome({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const visible = links.filter((l) => !l.roles || !role || l.roles.includes(role));

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="border-b border-stone-200 bg-white">
        <div className="container-site flex h-14 items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-semibold">
            Travelling Dreams Admin
          </Link>
          <button
            type="button"
            className="text-sm text-brand-700"
            onClick={() =>
              fetch("/api/auth/admin/logout", { method: "POST" }).then(() =>
                location.assign("/admin/login")
              )
            }
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container-site grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {visible.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
