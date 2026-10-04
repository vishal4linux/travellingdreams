"use client";

import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

type Props = {
  startingRate: number | null;
  bookHref: string;
  whatsappHref: string;
  isBookable?: boolean;
};

export function HotelMobileBar({
  startingRate,
  bookHref,
  whatsappHref,
  isBookable = true,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-elevated/95 p-3 backdrop-blur-md md:hidden">
      <div className="container-site flex items-center justify-between gap-3">
        <div>
          {startingRate != null ? (
            <>
              <p className="text-xs text-ink-subtle">From</p>
              <p className="font-display text-lg font-semibold text-brand-800">
                {formatINR(startingRate)}
              </p>
            </>
          ) : null}
        </div>
        <div className="flex gap-2">
          <ButtonLink href={whatsappHref} variant="whatsapp" size="sm">
            WhatsApp
          </ButtonLink>
          {isBookable ? (
            <ButtonLink href={bookHref} size="sm">
              Book now
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
