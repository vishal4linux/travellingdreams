import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Poster = {
  href: string;
  title: string;
  subtitle?: string | null;
  image: string;
};

export function PosterRail({
  title,
  href,
  linkLabel,
  items,
}: {
  title: string;
  href: string;
  linkLabel: string;
  items: Poster[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="container-site mb-4 flex items-end justify-between gap-3">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-bold text-brand-800 hover:underline">
          {linkLabel}
        </Link>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative h-64 w-[78vw] max-w-[320px] shrink-0 overflow-hidden rounded-2xl sm:h-72 sm:w-80"
          >
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-950">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="absolute bottom-0 p-4 text-white">
              <span className="block text-lg font-bold leading-tight">{item.title}</span>
              {item.subtitle ? (
                <span className="mt-1 block text-sm text-white/85">{item.subtitle}</span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
