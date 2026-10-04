import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPackagesPage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.package.findMany({ orderBy: { title: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Packages</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((p) => (
          <li key={p.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-stone-600">
              {p.durationNights}N/{p.durationDays}D · {p.isPublished ? "Published" : "Draft"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
