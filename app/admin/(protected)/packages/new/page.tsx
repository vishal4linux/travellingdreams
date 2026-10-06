import { PackageEditor } from "@/components/admin/PackageEditor";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewPackagePage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-brand-700 hover:underline">
        ← Packages
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">Add package</h1>
      <div className="mt-6">
        <PackageEditor destinations={destinations} />
      </div>
    </div>
  );
}
