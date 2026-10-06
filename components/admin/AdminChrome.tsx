"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  ImageIcon,
  LayoutDashboard,
  MapPinned,
  MessageSquare,
  Package,
  Percent,
  Settings2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: CalendarDays,
    roles: ["ADMIN", "BOOKING_MANAGER"],
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: MessageSquare,
    roles: ["ADMIN", "BOOKING_MANAGER"],
  },
  {
    href: "/admin/destinations",
    label: "Destinations",
    icon: MapPinned,
    roles: ["ADMIN", "CONTENT_MANAGER"],
  },
  {
    href: "/admin/hotels",
    label: "Hotels",
    icon: Building2,
    roles: ["ADMIN", "HOTEL_MANAGER"],
  },
  {
    href: "/admin/packages",
    label: "Packages",
    icon: Package,
    roles: ["ADMIN", "CONTENT_MANAGER"],
  },
  {
    href: "/admin/offers",
    label: "Offers",
    icon: Percent,
    roles: ["ADMIN", "CONTENT_MANAGER"],
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: ImageIcon,
    roles: ["ADMIN", "CONTENT_MANAGER", "HOTEL_MANAGER"],
  },
  {
    href: "/admin/settings",
    label: "Website content",
    icon: Settings2,
    roles: ["ADMIN", "CONTENT_MANAGER"],
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: Tag,
    roles: ["ADMIN", "BOOKING_MANAGER"],
  },
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f0ea_0%,#faf8f5_40%,#f3f4f6_100%)]">
      <header className="sticky top-0 z-40 border-b border-brand-200/60 bg-brand-950/95 text-white backdrop-blur">
        <div className="container-site flex h-14 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold">
              TD
            </span>
            <span className="hidden font-display text-lg font-semibold sm:inline">
              Travelling Dreams
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-100">
              Studio
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {role ? (
              <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-xs text-brand-100 sm:inline">
                {role.replace("_", " ")}
              </span>
            ) : null}
            <Link
              href="/"
              target="_blank"
              className="text-brand-200 hover:text-white"
            >
              View site
            </Link>
            <button
              type="button"
              className="rounded-lg bg-white/10 px-3 py-1.5 font-medium hover:bg-white/15"
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
      </header>

      <div className="container-site grid gap-6 py-6 lg:grid-cols-[240px_1fr] lg:py-8">
        <nav className="h-fit space-y-1 rounded-2xl border border-stone-200/80 bg-white/80 p-2 shadow-sm backdrop-blur lg:sticky lg:top-20">
          {visible.map((l) => {
            const active =
              l.href === "/admin"
                ? pathname === "/admin"
                : pathname === l.href || pathname.startsWith(`${l.href}/`);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-stone-700 hover:bg-brand-50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
