"use client";

import { SearchSuggest } from "@/components/search/SearchSuggest";
import { Search } from "lucide-react";
import Link from "next/link";

export function HeaderSearch() {
  return (
    <>
      <div className="hidden max-w-xs flex-1 lg:block xl:max-w-md">
        <SearchSuggest />
      </div>
      <Link
        href="/search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/50 hover:text-ink lg:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Link>
    </>
  );
}

