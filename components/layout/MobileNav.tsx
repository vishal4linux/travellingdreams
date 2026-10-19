"use client";

import { NAV_LINKS } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-slate-950/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <nav
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile"
      >
        <div className="border-b border-slate-100 px-5 pb-4 pt-28">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Menu</p>
          <p className="mt-1 text-sm text-slate-600">Hotels, packages, custom trips and rates.</p>
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-semibold",
                  active ? "bg-teal-700 text-white" : "text-slate-800 hover:bg-teal-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="grid gap-2 border-t border-slate-100 p-4">
          <Link
            href="/customize-trip"
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white"
          >
            Plan a custom itinerary
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="rounded-xl bg-teal-700 px-4 py-3 text-center text-sm font-bold text-white"
          >
            Ask for rates
          </Link>
          <Link
            href="/account/lookup"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-800"
          >
            Find my booking
          </Link>
          <Link
            href="/account/login"
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-teal-800"
          >
            Login
          </Link>
        </div>
      </nav>
    </div>
  );
}
