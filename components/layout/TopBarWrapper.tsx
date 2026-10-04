"use client";

import { TopBar } from "@/components/layout/TopBar";
import { usePathname } from "next/navigation";

export function TopBarWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <TopBar />;
}
