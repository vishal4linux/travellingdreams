import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageManager } from "@/components/admin/ImageManager";
import { ItineraryEditor } from "@/components/admin/ItineraryEditor";
import { PackageEditor } from "@/components/admin/PackageEditor";
import { requireAdmin } from "@/lib/auth/rbac";
import { decimalToNumber } from "@/lib/serialize";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
      },
    }),
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!pkg) notFound();

  const primaryDest = pkg.destinations[0]?.destination;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/packages" className="text-sm text-brand-700 hover:underline">
            ← Packages
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold">{pkg.title}</h1>
          {primaryDest ? (
            <p className="mt-1 text-sm text-stone-600">
              Public:{" "}
              <Link
                href={`/packages/${primaryDest.slug}/${pkg.slug}`}
                className="text-brand-700 hover:underline"
                target="_blank"
              >
                /packages/{primaryDest.slug}/{pkg.slug}
              </Link>
            </p>
          ) : null}
        </div>
        <DeleteButton
          url={`/api/admin/packages/${pkg.id}`}
          redirectTo="/admin/packages"
          confirmMessage={`Delete "${pkg.title}" permanently?`}
        />
      </div>

      <PackageEditor
        destinations={destinations}
        initial={{
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
          basePrice: decimalToNumber(pkg.basePrice) ?? 0,
          theme: pkg.theme,
          heroImage: pkg.heroImage,
          isPublished: pkg.isPublished,
          isFeatured: pkg.isFeatured,
        }}
      />

      <ImageManager
        label="Package gallery"
        images={pkg.images}
        uploadUrl={`/api/admin/packages/${pkg.id}/images`}
      />

      <ItineraryEditor packageId={pkg.id} days={pkg.itinerary} />
    </div>
  );
}
