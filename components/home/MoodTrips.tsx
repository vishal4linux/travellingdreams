import { Compass, Heart, Mountain, Palmtree, Users } from "lucide-react";
import Link from "next/link";

const moods = [
  { label: "Adventure", icon: Mountain, href: "/packages?q=adventure", color: "bg-sky-500" },
  { label: "Honeymoon", icon: Heart, href: "/packages?q=honeymoon", color: "bg-rose-500" },
  { label: "Family", icon: Users, href: "/packages?q=family", color: "bg-emerald-500" },
  { label: "Spiritual", icon: Compass, href: "/packages?q=spiritual", color: "bg-violet-500" },
  { label: "Relaxing", icon: Palmtree, href: "/packages?q=relaxing", color: "bg-teal-500" },
];

export function MoodTrips() {
  return (
    <section className="section-padding">
      <div className="container-site text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          Still deciding?
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Pick a mood, find your trip
        </h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-4">
          {moods.map(({ label, icon: Icon, href, color }) => (
            <li key={label}>
              <Link
                href={href}
                className="glass group flex w-28 flex-col items-center gap-3 rounded-[1.5rem] px-4 py-5 transition-all hover:-translate-y-1 sm:w-32"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ${color}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-ink group-hover:text-accent-700">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
