"use client";

import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

type Props = {
  basePrice: number;
  bookHref: string;
  whatsappHref: string;
};

export function PackageMobileBar({ basePrice, bookHref, whatsappHref }: Props) {
  return (
    <div className="glass fixed inset-x-3 bottom-3 z-40 rounded-full px-4 py-2 md:hidden">
      <div className="container-site flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-subtle">From</p>
          <p className="font-display text-lg font-semibold text-brand-800">{formatINR(basePrice)}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={whatsappHref} variant="whatsapp" size="sm">
            WhatsApp
          </ButtonLink>
          <ButtonLink href={bookHref} size="sm">
            Book now
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
