import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`suggest:${ip}`, 60, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const [destinations, hotels, packages] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, name: { contains: q } },
      take: 5,
      select: { name: true, slug: true },
    }),
    prisma.hotel.findMany({
      where: { isPublished: true, name: { contains: q } },
      take: 5,
      select: { name: true, slug: true, destination: { select: { slug: true } } },
    }),
    prisma.package.findMany({
      where: { isPublished: true, title: { contains: q } },
      take: 5,
      select: { title: true, slug: true, destinations: { take: 1, select: { destination: { select: { slug: true } } } } },
    }),
  ]);

  const results = [
    ...destinations.map((d) => ({
      type: "destination" as const,
      label: d.name,
      href: `/destinations/${d.slug}`,
    })),
    ...hotels.map((h) => ({
      type: "hotel" as const,
      label: h.name,
      href: `/hotels/${h.destination.slug}/${h.slug}`,
    })),
    ...packages.map((p) => ({
      type: "package" as const,
      label: p.title,
      href: `/packages/${p.destinations[0]?.destination.slug ?? "india"}/${p.slug}`,
    })),
  ];

  return NextResponse.json({ results });
}
