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
    <div className="space-y-6">
      <div>
        <Link href="/admin/packages" className="text-sm font-medium text-brand-700 hover:underline">
          ← Package studio
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Create a package
        </h1>
        <p className="mt-2 max-w-xl text-sm text-stone-600">
          Start with the basics. After save you&apos;ll unlock gallery, day itinerary and the
          interactive map places editor.
        </p>
      </div>
      <PackageEditor destinations={destinations} />
    </div>
  );
}
