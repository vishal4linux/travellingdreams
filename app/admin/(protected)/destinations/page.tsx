import { CreateDestinationForm } from "@/components/admin/CreateDestinationForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DestinationEditor } from "@/components/admin/DestinationEditor";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDestinationsPage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.destination.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Destinations</h1>
      <p className="mt-2 text-sm text-stone-600">
        Edit names, images and copy shown on destination cards and detail pages.
      </p>
      <CreateDestinationForm />
      <ul className="mt-6 space-y-3">
        {rows.map((d) => (
          <li key={d.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-stone-600">
                  {d.slug}
                  {!d.isPublished ? " · unpublished" : ""}
                  {d.isPopular ? " · popular" : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/destinations/${d.slug}`} className="text-sm text-brand-700" target="_blank">
                  View live
                </Link>
                <DestinationEditor destination={d} />
                <DeleteButton
                  url={`/api/admin/destinations/${d.id}`}
                  confirmMessage={`Delete destination "${d.name}"?`}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
