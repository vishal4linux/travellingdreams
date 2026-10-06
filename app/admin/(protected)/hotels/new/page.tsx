import { HotelEditor } from "@/components/admin/HotelEditor";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewHotelPage() {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link href="/admin/hotels" className="text-sm text-brand-700 hover:underline">
        ← Hotels
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">Add hotel</h1>
      <div className="mt-6">
        <HotelEditor destinations={destinations} />
      </div>
    </div>
  );
}
