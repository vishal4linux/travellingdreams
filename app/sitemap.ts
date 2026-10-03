import { getDestinationSlugs } from "@/services/destinations";
import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/destinations",
    "/hotels",
    "/packages",
    "/la-riqueza-hotels",
    "/offers",
    "/customize-trip",
    "/contact",
    "/about",
    "/search",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  try {
    const [destSlugs, hotels, packages, blogs] = await Promise.all([
      getDestinationSlugs(),
      prisma.hotel.findMany({
        where: { isPublished: true },
        select: { slug: true, destination: { select: { slug: true } } },
      }),
      prisma.package.findMany({
        where: { isPublished: true },
        select: {
          slug: true,
          destinations: { take: 1, select: { destination: { select: { slug: true } } } },
        },
      }),
      prisma.blog.findMany({ where: { isPublished: true }, select: { slug: true } }),
    ]);

    return [
      ...staticRoutes,
      ...destSlugs.map((r) => ({
        url: `${base}/destinations/${r.slug}`,
        lastModified: new Date(),
      })),
      ...hotels.map((h) => ({
        url: `${base}/hotels/${h.destination.slug}/${h.slug}`,
        lastModified: new Date(),
      })),
      ...packages.map((p) => ({
        url: `${base}/packages/${p.destinations[0]?.destination.slug ?? "india"}/${p.slug}`,
        lastModified: new Date(),
      })),
      ...blogs.map((b) => ({
        url: `${base}/inspiration/${b.slug}`,
        lastModified: new Date(),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
