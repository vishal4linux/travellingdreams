export function splitLines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function stayStops(
  days: { locationName?: string | null }[]
): { name: string; days: number }[] {
  const stops: { name: string; days: number }[] = [];
  for (const day of days) {
    const name = day.locationName?.trim();
    if (!name) continue;
    const last = stops[stops.length - 1];
    if (last && last.name.toLowerCase() === name.toLowerCase()) last.days += 1;
    else stops.push({ name, days: 1 });
  }
  return stops;
}
