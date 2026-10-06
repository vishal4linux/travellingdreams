import { DeleteButton } from "@/components/admin/DeleteButton";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/rbac";
import { formatINR } from "@/lib/utils";
import { decimalToNumber } from "@/lib/serialize";
import { prisma } from "@/lib/prisma";
import { Map, Route } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPackagesPage() {
  try {
    await requireAdmin(["ADMIN", "CONTENT_MANAGER"]);
  } catch {
    redirect("/admin");
  }

  const rows = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      destinations: {
        take: 1,
        include: { destination: true },
      },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      _count: { select: { images: true, itinerary: true, attractions: true } },
    },
  });

  const live = rows.filter((p) => p.isPublished).length;
  const withMap = rows.filter((p) => p._count.attractions > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Package studio</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            Craft packages travellers actually want — rich itineraries, clickable map places and
            gallery-ready stories.
          </p>
        </div>
        <ButtonLink href="/admin/packages/new">Add package</ButtonLink>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-ink">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Live</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{live}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            With map places
          </p>
          <p className="mt-1 text-2xl font-bold text-accent-700">{withMap}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {rows.map((p) => {
          const dest = p.destinations[0]?.destination;
          const thumb = p.heroImage ?? p.images[0]?.url;
          return (
            <li
              key={p.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-stretch gap-0 sm:flex-nowrap">
                <div className="relative h-28 w-full shrink-0 bg-brand-100 sm:h-auto sm:w-36">
                  {thumb ? (
                    <Image src={thumb} alt="" fill className="object-cover" sizes="144px" />
                  ) : (
                    <div className="flex h-full min-h-28 items-center justify-center text-brand-400">
                      <PackageIcon />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/packages/${p.id}`}
                      className="font-semibold text-brand-900 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-1 text-sm text-stone-600">
                      {dest?.name ?? "No destination"} ·{" "}
                      {formatINR(decimalToNumber(p.basePrice) ?? 0)} · {p.durationNights}N/
                      {p.durationDays}D
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span
                        className={
                          p.isPublished
                            ? "rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700"
                            : "rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700"
                        }
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                      {p.isFeatured ? (
                        <span className="rounded-full bg-accent-50 px-2 py-0.5 font-medium text-accent-700">
                          Featured
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                        <Route className="h-3 w-3" />
                        {p._count.itinerary} days
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                        <Map className="h-3 w-3" />
                        {p._count.attractions} places
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                        {p._count.images} photos
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/admin/packages/${p.id}`} variant="secondary" size="sm">
                      Open studio
                    </ButtonLink>
                    <DeleteButton
                      url={`/api/admin/packages/${p.id}`}
                      confirmMessage={`Delete package "${p.title}"?`}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PackageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}
