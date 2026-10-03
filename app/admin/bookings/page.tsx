import { AdminBookingStatusSelect } from "@/components/admin/AdminBookingStatusSelect";
import { requireAdmin } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminBookingsPage() {
  try {
    await requireAdmin(["ADMIN", "BOOKING_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const bookings = await prisma.booking.findMany({    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      hotelBooking: { include: { hotel: true } },
      packageBooking: { include: { package: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Bookings</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-stone-50 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Product</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-stone-100">
                <td className="p-3 font-mono">
                  <Link href={`/booking/confirmation/${b.bookingNumber}`} className="text-brand-700">
                    {b.bookingNumber}
                  </Link>
                </td>
                <td className="p-3">{b.type}</td>
                <td className="p-3">
                  <AdminBookingStatusSelect bookingId={b.id} current={b.status} />
                </td>
                <td className="p-3">{formatINR(decimalToNumber(b.totalAmount) ?? 0)}</td>
                <td className="p-3">
                  {b.hotelBooking?.hotel.name ?? b.packageBooking?.package.title ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
