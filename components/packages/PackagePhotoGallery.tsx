import Image from "next/image";

type Props = {
  images: { url: string; alt: string | null }[];
  title: string;
};

export function PackagePhotoGallery({ images, title }: Props) {
  if (images.length <= 1) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-ink">Trip gallery</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.slice(0, 6).map((img, i) => (
          <div
            key={`${img.url}-${i}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
          >
            <Image
              src={img.url}
              alt={img.alt ?? `${title} photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width:640px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
