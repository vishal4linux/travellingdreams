import { PackageStudio } from "@/components/admin/PackageStudio";
import { requireAdmin } from "@/lib/auth/rbac";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPackagePage({ params }: Props) {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const { id } = await params;
  const [pkg, destinations] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: {
        destinations: { include: { destination: true }, orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        itinerary: { orderBy: { dayNumber: "asc" } },
        attractions: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!pkg) notFound();

  const primaryDest = pkg.destinations[0]?.destination;
  const price = decimalToNumber(pkg.basePrice) ?? 0;

  return (
    <PackageStudio
      packageId={pkg.id}
      title={pkg.title}
      publicPath={
        primaryDest ? `/packages/${primaryDest.slug}/${pkg.slug}` : null
      }
      priceLabel={`${formatINR(price)} · ${pkg.durationNights}N / ${pkg.durationDays}D`}
      isPublished={pkg.isPublished}
      isFeatured={pkg.isFeatured}
      imageCount={pkg.images.length}
      dayCount={pkg.itinerary.length}
      placeCount={pkg.attractions.length}
      destinations={destinations}
      editorInitial={{
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        destinationId: primaryDest?.id ?? "",
        durationNights: pkg.durationNights,
        durationDays: pkg.durationDays,
        startingCity: pkg.startingCity,
        placesCovered: pkg.placesCovered,
        meals: pkg.meals,
        transport: pkg.transport,
        highlights: pkg.highlights,
        description: pkg.description,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        cancellationPolicy: pkg.cancellationPolicy,
        terms: pkg.terms,
        rating: pkg.rating,
        reviewCount: pkg.reviewCount,
        basePrice: price,
        theme: pkg.theme,
        heroImage: pkg.heroImage,
        isPublished: pkg.isPublished,
        isFeatured: pkg.isFeatured,
      }}
      images={pkg.images}
      itineraryDays={pkg.itinerary}
      attractions={pkg.attractions}
      faqs={pkg.faqs}
    />
  );
}
