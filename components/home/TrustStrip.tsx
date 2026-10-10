import { Award, MapPin, Users } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "10,000+",
    subtitle: "Happy travellers",
  },
  {
    icon: MapPin,
    title: "50+",
    subtitle: "Curated packages",
  },
  {
    icon: Award,
    title: "LA Riqueza",
    subtitle: "Partner hotels",
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-10 -mt-8 md:-mt-12">
      <div className="container-site">
        <div className="glass grid gap-3 rounded-[1.75rem] p-4 sm:grid-cols-3 sm:gap-0 sm:p-0">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-6 py-4 sm:justify-center sm:py-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/60 text-accent-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-lg font-bold tracking-tight text-ink">{title}</p>
                <p className="text-sm text-ink-muted">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
