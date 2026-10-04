import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminOffersPage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const offers = await prisma.offer.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Offers</h1>
      <p className="mt-2 text-sm text-stone-600">Promotional tiles shown on the homepage and offers page.</p>
      <ul className="mt-6 space-y-2">
        {offers.map((o) => (
          <li
            key={o.id}
            className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium">{o.title}</p>
              {o.badge ? <p className="text-xs text-stone-500">{o.badge}</p> : null}
            </div>
            <Link href="/offers" className="text-sm text-brand-700">
              View live
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
