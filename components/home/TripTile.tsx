import { formatINR } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fallback =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop";

export function TripTile({
  href,
  title,
  image,
  place,
  nights,
  days,
  price,
}: {
  href: string;
  title: string;
  image: string | null;
  place: string;
  nights: number;
  days: number;
  price: number;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={image || fallback}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-900">
          {nights}N / {days}D
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink group-hover:text-brand-800">
          {title}
        </h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {place}
        </p>
        <p className="mt-auto pt-4 text-lg font-bold text-accent-700">
          {formatINR(price)}
          <span className="text-xs font-medium text-ink-subtle"> / person</span>
        </p>
      </div>
    </Link>
  );
}
