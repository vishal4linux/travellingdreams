import { CreateCouponForm } from "@/components/admin/CreateCouponForm";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminCouponsPage() {
  try {
    await requireAdmin(["ADMIN", "BOOKING_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Coupons</h1>
      <CreateCouponForm />
      <ul className="mt-6 space-y-2">
        {coupons.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3"
          >
            <span className="font-mono font-medium">{c.code}</span>
            <span className="text-sm text-stone-600">
              {c.discountType === "PERCENT" ? `${Number(c.discountValue)}%` : `₹${Number(c.discountValue)}`} · used{" "}
              {c.usedCount}
              {c.maxUses ? ` / ${c.maxUses}` : ""}
            </span>
            <span className="text-xs uppercase text-stone-500">{c.isActive ? "Active" : "Inactive"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
