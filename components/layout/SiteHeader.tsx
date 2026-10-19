"use client";

import { SITE } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { Menu, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { MobileNav } from "./MobileNav";

const PRIMARY_LINKS = [
  { href: "/hotels", label: "Hotels" },
  { href: "/packages", label: "Packages" },
  { href: "/destinations", label: "Destinations" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hideChrome = pathname.startsWith("/admin");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (hideChrome) return null;

  const phone = SITE.partnerPhones[0].replace(/\s/g, "");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-200 bg-white shadow-[0_8px_24px_-18px_rgba(47,28,22,0.45)]">
        <div className="bg-brand-950 text-brand-100">
          <div className="container-site flex h-9 items-center justify-between gap-3 text-xs sm:text-sm">
            <a href={`tel:${phone}`} className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-white">
              <Phone className="h-3.5 w-3.5 shrink-0 text-accent-300" aria-hidden />
              <span className="truncate">{SITE.partnerPhones[0]}</span>
            </a>
            <Link href="/contact" className="shrink-0 font-semibold text-accent-300 hover:text-white">
              Get rates
            </Link>
          </div>
        </div>

        <div className="container-site flex h-16 items-center gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-sm font-bold text-white">
              TD
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold text-ink sm:text-lg">
                {SITE.name}
              </span>
              <span className="hidden text-[11px] font-medium text-brand-700 sm:block">
                Hotels & holidays
              </span>
            </span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {PRIMARY_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold",
                    active
                      ? "bg-brand-800 text-white"
                      : "text-ink hover:bg-brand-50 hover:text-brand-800"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <HeaderSearch />
            <Link
              href="/account/login"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink hover:bg-brand-50 hover:text-brand-800 md:inline-flex"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
            <Link
              href="/customize-trip"
              className="inline-flex items-center rounded-lg bg-accent-600 px-3 py-2 text-sm font-bold text-white hover:bg-accent-700"
            >
              Plan my trip
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-brand-50"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
