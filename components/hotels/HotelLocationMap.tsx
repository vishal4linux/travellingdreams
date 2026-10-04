import { googleMapsPlaceUrl, openStreetMapEmbedUrl, type MapStop } from "@/lib/maps";
import { ExternalLink, MapPin } from "lucide-react";

type Props = {
  name: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
};

export function HotelLocationMap({ name, city, state, latitude, longitude }: Props) {
  if (latitude == null || longitude == null) return null;

  const stop: MapStop = {
    dayNumber: 1,
    name,
    latitude,
    longitude,
  };
  const embedUrl = openStreetMapEmbedUrl([stop], stop);
  const mapsUrl = googleMapsPlaceUrl(latitude, longitude, `${name}, ${city}`);

  return (
    <section className="rounded-2xl border border-border bg-surface-elevated overflow-hidden shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Location</h2>
          <p className="text-sm text-ink-muted">
            {city}, {state}
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-2 text-xs font-semibold text-white hover:bg-accent-700"
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          Directions
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>
      <iframe
        title={`Map — ${name}`}
        src={embedUrl}
        className="h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
