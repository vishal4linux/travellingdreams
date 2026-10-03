"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { usePathname } from "next/navigation";

export function SiteFooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteFooter />;
}
