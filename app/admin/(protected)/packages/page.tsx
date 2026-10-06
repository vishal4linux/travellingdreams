import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/rbac";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPackagesPage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      destinations: {
        take: 1,
        include: { destination: true },
      },
      _count: { select: { images: true, itinerary: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Packages</h1>
        <ButtonLink href="/admin/packages/new">Add package</ButtonLink>
      </div>
      <p className="mt-2 text-sm text-stone-600">
        Manage holiday package content, prices, photos and day-by-day itinerary.
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map((p) => {
          const dest = p.destinations[0]?.destination;
          return (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div>
                <Link
                  href={`/admin/packages/${p.id}`}
                  className="font-medium text-brand-800 hover:underline"
                >
                  {p.title}
                </Link>
                <p className="text-sm text-stone-600">
                  {dest?.name ?? "—"} · {formatINR(decimalToNumber(p.basePrice) ?? 0)} ·{" "}
                  {p._count.images} photos · {p._count.itinerary} days
                  {!p.isPublished ? " · unpublished" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href={`/admin/packages/${p.id}`} variant="secondary" size="sm">
                  Edit
                </ButtonLink>
                <DeleteButton
                  url={`/api/admin/packages/${p.id}`}
                  confirmMessage={`Delete package "${p.title}"?`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
