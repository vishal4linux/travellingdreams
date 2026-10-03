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
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border bg-surface/95 shadow-[var(--shadow-nav)] backdrop-blur-md"
            : "bg-surface/80 backdrop-blur-sm"
        )}
      >
        <div className="container-site">
          <div className="flex h-16 flex-wrap items-center justify-between gap-3 lg:h-[4.25rem] lg:flex-nowrap">
            <Link href="/" className="group flex shrink-0 flex-col">
              <span className="font-display text-xl font-semibold tracking-tight text-ink lg:text-2xl">
                {SITE.name}
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-widest text-ink-subtle sm:block">
                {SITE.partnerTagline}
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
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink md:hidden"
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
