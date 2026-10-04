export type MapStop = {
  dayNumber: number;
  name: string;
  latitude: number;
  longitude: number;
};

export function googleMapsPlaceUrl(latitude: number, longitude: number, label?: string): string {
  const q = label ? encodeURIComponent(label) : `${latitude},${longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function googleMapsDirectionsUrl(stops: MapStop[]): string {
  if (stops.length === 0) return "https://www.google.com/maps";
  if (stops.length === 1) {
    return googleMapsPlaceUrl(stops[0].latitude, stops[0].longitude, stops[0].name);
  }
  const path = stops.map((s) => `${s.latitude},${s.longitude}`).join("/");
  return `https://www.google.com/maps/dir/${path}`;
}

/** OpenStreetMap embed bbox around stops (no API key). */
export function openStreetMapEmbedUrl(stops: MapStop[], focus?: MapStop): string {
  if (stops.length === 0) return "https://www.openstreetmap.org/export/embed.html?layer=mapnik";
  const lats = stops.map((s) => s.latitude);
  const lngs = stops.map((s) => s.longitude);
  const pad = 0.08;
  const minLon = Math.min(...lngs) - pad;
  const maxLon = Math.max(...lngs) + pad;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const marker = focus ?? stops[0];
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${marker.latitude}%2C${marker.longitude}`;
}
