"use client";

import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNav } from "./MobileNav";
import { HeaderSearch } from "./HeaderSearch";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hideChrome = pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (hideChrome) return null;

  return (
    <>
      <header className="sticky top-3 z-50 w-full px-3 sm:px-4">
        <div className="container-site">
          <div
            className={cn(
              "glass flex h-16 flex-wrap items-center justify-between gap-3 rounded-full px-3 transition-shadow duration-300 sm:px-5 lg:h-[4.25rem] lg:flex-nowrap",
              scrolled && "shadow-[var(--shadow-nav)]"
            )}
          >
            <Link href="/" className="group flex shrink-0 items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-gradient-to-b from-accent-400 to-brand-800 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                TD
              </span>
              <span className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-ink lg:text-xl">
                {SITE.name}
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-widest text-ink-subtle sm:block">
                {SITE.partnerTagline}
              </span>
              </span>
            </Link>

            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Primary"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-white/50 hover:text-accent-800",
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-white/70 text-accent-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      : "text-ink-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <HeaderSearch />

            <div className="flex items-center gap-1 sm:gap-2">
              <ButtonLink
                href="/account/lookup"
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                My Booking
              </ButtonLink>
              <ButtonLink
                href="/account/login"
                variant="secondary"
                size="sm"
                className="hidden md:inline-flex"
              >
                <User className="h-4 w-4" />
                Login
              </ButtonLink>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
