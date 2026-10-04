import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  slug: string;
  tagline: string | null;
  cardImage: string | null;
  state: string | null;
};

export function DestinationCard({ name, slug, tagline, cardImage, state }: Props) {
  const image =
    cardImage ??
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop";

  return (
    <Link href={`/destinations/${slug}`} className="group block h-full min-w-[240px] sm:min-w-0">
      <Card className="h-full overflow-hidden border-0 p-0 ring-1 ring-border/50">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
          <div className="absolute bottom-0 p-5 text-white">
            {state ? (
              <p className="text-xs font-medium uppercase tracking-widest text-brand-200">
                {state}
              </p>
            ) : null}
            <h3 className="mt-1 text-xl font-bold tracking-tight">{name}</h3>
            {tagline ? (
              <p className="mt-2 line-clamp-2 text-sm text-brand-100">{tagline}</p>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
