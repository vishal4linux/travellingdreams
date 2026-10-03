import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminHotelsPage() {
  try {
    await requireAdmin(["ADMIN", "HOTEL_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.hotel.findMany({
    orderBy: { name: "asc" },
    include: { destination: true, roomTypes: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Hotels</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((h) => (
          <li key={h.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="font-medium">{h.name}</p>
            <p className="text-sm text-stone-600">
              {h.destination.name} · {h.roomTypes.length} room type(s) ·{" "}
              {h.isLaRiqueza ? "LA Riqueza" : "Partner"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
