export type DayAttraction = {
  name: string;
  whyVisit?: string;
  tip?: string;
  category?: string;
};

export function parseDayAttractions(json: string | null | undefined): DayAttraction[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter((x): x is DayAttraction => typeof x === "object" && x != null && typeof (x as DayAttraction).name === "string")
      .map((x) => ({
        name: x.name,
        whyVisit: x.whyVisit,
        tip: x.tip,
        category: x.category ?? "sightseeing",
      }));
  } catch {
    return [];
  }
}

export function stringifyDayAttractions(items: DayAttraction[]): string {
  return JSON.stringify(items);
}

export const ATTRACTION_CATEGORIES = [
  { id: "famous", label: "Famous landmark", color: "#ea580c" },
  { id: "sightseeing", label: "Must visit", color: "#0d9488" },
  { id: "viewpoint", label: "Viewpoint", color: "#0284c7" },
  { id: "culture", label: "Culture & temples", color: "#7c3aed" },
  { id: "adventure", label: "Adventure", color: "#dc2626" },
  { id: "food", label: "Food & local", color: "#ca8a04" },
  { id: "nature", label: "Nature", color: "#16a34a" },
] as const;

export function categoryMeta(category: string) {
  return (
    ATTRACTION_CATEGORIES.find((c) => c.id === category) ?? ATTRACTION_CATEGORIES[1]
  );
}
