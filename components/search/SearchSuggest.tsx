"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SearchSuggest() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ type: string; label: string; href: string }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search destinations, hotels, packages…"
        aria-label="Search"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && results.length > 0 ? (
        <ul className="glass absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-3xl py-1">
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="block px-4 py-2 text-sm hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                <span className="text-xs uppercase text-ink-subtle">{r.type}</span>
                <span className="ml-2">{r.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
