import { AdminEnquiryStatusSelect } from "@/components/admin/AdminEnquiryStatusSelect";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminEnquiriesPage() {
  try {
    await requireAdmin(["ADMIN", "BOOKING_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { destination: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Enquiries</h1>
      <ul className="mt-6 space-y-4">
        {rows.map((e) => (
          <li key={e.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">
                {e.name} · {e.phone}
              </p>
              <AdminEnquiryStatusSelect enquiryId={e.id} current={e.status} />
            </div>
            <p className="mt-1 text-sm text-stone-600">{e.email}</p>
            <p className="mt-2 text-sm">
              {e.destination?.name ?? e.destinationText ?? "Custom trip"} · {e.tripType ?? "—"}
            </p>
            {e.specialRequirements ? (
              <p className="mt-2 text-sm text-stone-600">{e.specialRequirements}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
