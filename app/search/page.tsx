import { SearchSuggest } from "@/components/search/SearchSuggest";
import { ButtonLink } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="section-padding container-site max-w-xl">
        <h1 className="font-display text-3xl font-semibold">Search</h1>
        <div className="mt-6">
          <SearchSuggest />
        </div>
      </div>
    );
  }

  const [destinations, hotels, packages] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, name: { contains: query } },
      take: 8,
    }),
    prisma.hotel.findMany({
      where: { isPublished: true, OR: [{ name: { contains: query } }, { city: { contains: query } }] },
      take: 8,
      include: { destination: true },
    }),
    prisma.package.findMany({
      where: { isPublished: true, title: { contains: query } },
      take: 8,
      include: { destinations: { include: { destination: true }, take: 1 } },
    }),
  ]);

  return (
    <div className="section-padding bg-surface">
      <div className="container-site">
        <h1 className="font-display text-3xl font-semibold">Results for “{query}”</h1>
        <div className="mt-4 max-w-md">
          <SearchSuggest />
        </div>
        <section className="mt-8">
          <h2 className="font-semibold">Destinations</h2>
          <ul className="mt-2 space-y-1">
            {destinations.map((d) => (
              <li key={d.id}>
                <Link href={`/destinations/${d.slug}`} className="text-brand-700">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="font-semibold">Hotels</h2>
          <ul className="mt-2 space-y-1">
            {hotels.map((h) => (
              <li key={h.id}>
                <Link href={`/hotels/${h.destination.slug}/${h.slug}`} className="text-brand-700">
                  {h.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="font-semibold">Packages</h2>
          <ul className="mt-2 space-y-1">
            {packages.map((p) => {
              const slug = p.destinations[0]?.destination.slug ?? "india";
              return (
                <li key={p.id}>
                  <Link href={`/packages/${slug}/${p.slug}`} className="text-brand-700">
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <ButtonLink href="/" className="mt-10" variant="secondary">
          Home
        </ButtonLink>
      </div>
    </div>
  );
}
