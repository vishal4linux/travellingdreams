import { CreateDestinationForm } from "@/components/admin/CreateDestinationForm";
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
      <CreateDestinationForm />      <ul className="mt-6 space-y-2">
        {rows.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 border border-stone-200">
            <span>{d.name}</span>
            <Link href={`/destinations/${d.slug}`} className="text-sm text-brand-700">
              View live
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
