import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
});

export function setting(
  map: Record<string, string>,
  key: string,
  fallback: string
): string {
  const v = map[key]?.trim();
  return v || fallback;
}
