"use client";

import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-brand-950/35 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <nav
        className={cn(
          "glass absolute right-3 top-3 flex h-[calc(100%-1.5rem)] w-[min(100%-1.5rem,22rem)] flex-col rounded-[1.75rem] shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile"
      >
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 pt-20">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-white/50"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-border p-4">
          <ButtonLink href="/account/bookings" variant="secondary" onClick={onClose}>
            My Booking
          </ButtonLink>
          <ButtonLink href="/account/login" variant="primary" onClick={onClose}>
            Login / Account
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
