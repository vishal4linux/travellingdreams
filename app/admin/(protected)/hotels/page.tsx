import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminHotelsPage() {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.hotel.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      destination: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      roomTypes: true,
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Hotels</h1>
        <ButtonLink href="/admin/hotels/new">Add hotel</ButtonLink>
      </div>
      <p className="mt-2 text-sm text-stone-600">
        Edit content, publish status and gallery images shown on the public website.
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map((h) => (
          <li
            key={h.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4"
          >
            <div>
              <Link href={`/admin/hotels/${h.id}`} className="font-medium text-brand-800 hover:underline">
                {h.name}
              </Link>
              <p className="text-sm text-stone-600">
                {h.destination.name} · {h.images.length} image(s) · {h.roomTypes.length} room type(s)
                {!h.isPublished ? " · unpublished" : ""}
                {!h.isBookable ? " · not bookable" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`/admin/hotels/${h.id}`} variant="secondary" size="sm">
                Edit
              </ButtonLink>
              <DeleteButton
                url={`/api/admin/hotels/${h.id}`}
                confirmMessage={`Delete hotel "${h.name}"?`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
