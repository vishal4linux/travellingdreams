import { SITE } from "@/lib/constants/site";
import { Headphones, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  const phone = SITE.partnerPhones[0].replace(/\s/g, "");

  return (
    <div className="hidden text-brand-100 md:block">
      <div className="container-site pt-2">
        <div className="glass-dark flex h-9 items-center justify-between rounded-full px-4 text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              <strong className="font-semibold text-white">4.8</strong> rated on Google &amp; reviews
            </span>
            <span className="hidden items-center gap-1.5 text-brand-300 lg:flex">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Secure payments &amp; clear cancellation terms
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 lg:flex">
              <Headphones className="h-3.5 w-3.5" aria-hidden />
              24×7 trip support
            </span>
            <Link
              href={`tel:${phone}`}
              className="font-medium text-white transition-colors hover:text-brand-200"
            >
              {SITE.partnerPhones[0]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
