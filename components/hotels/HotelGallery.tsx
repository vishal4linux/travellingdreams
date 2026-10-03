"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type ImageItem = { url: string; alt: string | null };

export function HotelGallery({ images, hotelName }: { images: ImageItem[]; hotelName: string }) {
  const list =
    images.length > 0
      ? images
      : [
          {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
            alt: hotelName,
          },
        ];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-brand-100">
        <Image
          src={list[active].url}
          alt={list[active].alt ?? hotelName}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 66vw"
          priority
        />
      </div>
      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-brand-600" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
