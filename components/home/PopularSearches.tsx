import Link from "next/link";

const searches = [
  { label: "Manali honeymoon package", href: "/packages?q=manali" },
  { label: "Spiti valley road trip", href: "/packages?q=spiti" },
  { label: "Kashmir family tour", href: "/packages?q=kashmir" },
  { label: "Ladakh bike trip", href: "/packages?q=ladakh" },
  { label: "LA Riqueza Kanatal", href: "/la-riqueza-hotels" },
  { label: "Delhi weekend getaway", href: "/packages?q=delhi" },
  { label: "Uttarakhand with parents", href: "/packages?q=uttarakhand" },
  { label: "Shimla Kufri package", href: "/packages?q=shimla" },
];

export function PopularSearches() {
  return (
    <section className="border-y border-border bg-white py-8">
      <div className="container-site">
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Popular searches
        </p>
        <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
          {searches.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-accent-300 hover:bg-accent-50 hover:text-accent-800"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
