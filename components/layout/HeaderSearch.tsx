"use client";

import { Search } from "lucide-react";
import Link from "next/link";

export function HeaderSearch() {
  return (
    <Link
      href="/search"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-brand-50 hover:text-brand-800"
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </Link>
  );
}
