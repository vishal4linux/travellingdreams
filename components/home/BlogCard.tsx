import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
};

export function BlogCard({ title, slug, excerpt, coverImage }: Props) {
  const image =
    coverImage ??
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop";

  return (
    <Link href={`/inspiration/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden p-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 25vw"
          />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand-800">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{excerpt}</p>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
