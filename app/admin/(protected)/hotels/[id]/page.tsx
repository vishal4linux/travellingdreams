import { DeleteButton } from "@/components/admin/DeleteButton";
import { HotelEditor } from "@/components/admin/HotelEditor";
import { ImageManager } from "@/components/admin/ImageManager";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditHotelPage({ params }: Props) {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const { id } = await params;
  const [hotel, destinations] = await Promise.all([
    prisma.hotel.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        destination: { select: { slug: true } },
      },
    }),
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!hotel) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/hotels" className="text-sm text-brand-700 hover:underline">
            ← Hotels
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold">{hotel.name}</h1>
          <p className="mt-1 text-sm text-stone-600">
            Public:{" "}
            <Link
              href={`/hotels/${hotel.destination.slug}/${hotel.slug}`}
              className="text-brand-700 hover:underline"
              target="_blank"
            >
              /hotels/{hotel.destination.slug}/{hotel.slug}
            </Link>
          </p>
        </div>
        <DeleteButton
          url={`/api/admin/hotels/${hotel.id}`}
          redirectTo="/admin/hotels"
          confirmMessage={`Delete "${hotel.name}" permanently?`}
        />
      </div>

      <HotelEditor
        destinations={destinations}
        initial={{
          id: hotel.id,
          name: hotel.name,
          slug: hotel.slug,
          destinationId: hotel.destinationId,
          brandPartner: hotel.brandPartner,
          isLaRiqueza: hotel.isLaRiqueza,
          isFeatured: hotel.isFeatured,
          starRating: hotel.starRating,
          address: hotel.address,
          city: hotel.city,
          state: hotel.state,
          shortDescription: hotel.shortDescription,
          description: hotel.description,
          policies: hotel.policies,
          isPublished: hotel.isPublished,
          isBookable: hotel.isBookable,
        }}
      />

      <ImageManager
        label="Hotel gallery"
        images={hotel.images}
        uploadUrl={`/api/admin/hotels/${hotel.id}/images`}
      />
    </div>
  );
}
