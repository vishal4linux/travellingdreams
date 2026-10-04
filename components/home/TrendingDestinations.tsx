import Image from "next/image";
import Link from "next/link";

type Destination = { name: string; slug: string; cardImage: string | null };

const fallbackImages: Record<string, string> = {
  "himachal-pradesh":
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop",
  "leh-ladakh":
    "https://images.unsplash.com/photo-1589308078059-141316f0680f?q=80&w=800&auto=format&fit=crop",
  kashmir:
    "https://images.unsplash.com/photo-1595815771612-94a9520a8d8c?q=80&w=800&auto=format&fit=crop",
  uttarakhand:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
  rajasthan:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop",
  delhi:
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop",
};

export function TrendingDestinations({ destinations }: { destinations: Destination[] }) {
  const list = destinations.slice(0, 8);

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <p className="text-sm font-medium text-white/90">Trending destinations</p>
      <ul className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto pb-1">
        {list.map((d) => {
          const img =
            d.cardImage ?? fallbackImages[d.slug] ?? fallbackImages["uttarakhand"];
          return (
            <li key={d.slug} className="shrink-0">
              <Link
                href={`/destinations/${d.slug}`}
                className="group flex w-[5.5rem] flex-col items-center gap-2 sm:w-24"
              >
                <span className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/30 ring-2 ring-white/10 transition-transform group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Image src={img} alt="" fill sizes="72px" className="object-cover" />
                </span>
                <span className="max-w-[5.5rem] truncate text-center text-xs font-medium text-white sm:max-w-24">
                  {d.name.split(" ")[0]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
