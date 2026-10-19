"use client";

import { NAV_LINKS, SITE } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { Menu, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeaderSearch } from "./HeaderSearch";
import { MobileNav } from "./MobileNav";

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
      <header className="sticky top-0 z-50 border-b border-teal-900/10 bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.45)]">
        <div className="bg-teal-800 text-white">
          <div className="container-site flex h-9 items-center justify-between gap-3 text-xs sm:text-sm">
            <a href={`tel:${phone}`} className="inline-flex min-w-0 items-center gap-1.5 font-semibold">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{SITE.partnerPhones[0]}</span>
            </a>
            <p className="hidden font-medium text-teal-50 md:block">
              Custom itineraries · clear rates · reply on WhatsApp
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/customize-trip" className="font-semibold text-amber-300 hover:text-white">
                Plan trip
              </Link>
              <Link href="/contact" className="font-semibold text-white hover:text-amber-200">
                Get rates
              </Link>
            </div>
          </div>
        </div>

        <div className="container-site flex h-16 items-center gap-3 lg:h-[4.25rem] lg:gap-4">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
              TD
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold leading-tight text-slate-900 sm:text-lg">
                {SITE.name}
              </span>
              <span className="hidden truncate text-[11px] font-medium text-teal-800 sm:block">
                Hotels & holiday packages
              </span>
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold",
                    active
                      ? "bg-teal-700 text-white"
                      : "text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                  )}
                >
                  {link.short}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <HeaderSearch />
            <Link
              href="/account/lookup"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 lg:inline-flex"
            >
              My booking
            </Link>
            <Link
              href="/account/login"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 hover:text-teal-800 md:inline-flex"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
            <Link
              href="/customize-trip"
              className="inline-flex items-center rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
            >
              <span className="sm:hidden">Plan</span>
              <span className="hidden sm:inline">Plan my trip</span>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 hover:bg-teal-50 xl:hidden"
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
