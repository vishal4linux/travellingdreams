import { getAdminDashboardStats } from "@/services/admin/dashboard";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const cards = [
    { label: "Today's bookings", value: stats.todayBookings },
    { label: "Pending payments", value: stats.pendingPayments },
    { label: "New enquiries", value: stats.newEnquiries },
    { label: "Total bookings", value: stats.totalBookings },
    {
      label: "Hotel revenue",
      value: formatINR(decimalToNumber(stats.hotelRevenue) ?? 0),
    },
    {
      label: "Package revenue",
      value: formatINR(decimalToNumber(stats.packageRevenue) ?? 0),
    },
    { label: "Upcoming arrivals (7d)", value: stats.upcomingArrivals },
    { label: "Upcoming departures (7d)", value: stats.upcomingDepartures },
    { label: "Popular destination", value: stats.popularDestination },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      {stats.dbError ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Database tables are missing or out of date. In Hostinger SSH run{" "}
          <code className="rounded bg-white px-1">npx prisma db push</code> then{" "}
          <code className="rounded bg-white px-1">npm run db:seed</code>.
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
