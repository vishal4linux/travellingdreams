"use client";

import { SearchSuggest } from "@/components/search/SearchSuggest";
import { Search } from "lucide-react";
import Link from "next/link";

export function HeaderSearch() {
  return (
    <>
      <div className="hidden w-52 2xl:block">
        <SearchSuggest compact />
      </div>
      <Link
        href="/search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800 2xl:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Link>
    </>
  );
}
