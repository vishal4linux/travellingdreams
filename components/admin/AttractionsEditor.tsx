"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ATTRACTION_CATEGORIES } from "@/lib/package-attractions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Attraction = {
  id: string;
  name: string;
  dayNumber: number | null;
  tagline: string | null;
  whyVisit: string | null;
  category: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
};

export function AttractionsEditor({
  packageId,
  attractions,
}: {
  packageId: string;
  attractions: Attraction[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Attraction | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      dayNumber: fd.get("dayNumber") ? Number(fd.get("dayNumber")) : null,
      tagline: String(fd.get("tagline") || "") || null,
      whyVisit: String(fd.get("whyVisit") || "") || null,
      category: String(fd.get("category") || "sightseeing"),
      latitude: fd.get("latitude") ? Number(fd.get("latitude")) : null,
      longitude: fd.get("longitude") ? Number(fd.get("longitude")) : null,
      imageUrl: String(fd.get("imageUrl") || "") || null,
    };

    try {
      const url = editing
        ? `/api/admin/packages/${packageId}/attractions/${editing.id}`
        : `/api/admin/packages/${packageId}/attractions`;
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setEditing(null);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this place from the map?")) return;
    setBusy(true);
    await fetch(`/api/admin/packages/${packageId}/attractions/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">Famous places & must-visits</h2>
        <p className="mt-1 text-sm text-stone-600">
          These pins appear on the public interactive journey map. Add lat/lng so travellers can
          click and learn why each place is famous.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {attractions.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{a.name}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {a.category}
                  {a.dayNumber ? ` · Day ${a.dayNumber}` : ""}
                  {a.latitude != null ? " · on map" : " · missing coords"}
                </p>
                {a.whyVisit ? (
                  <p className="mt-2 line-clamp-2 text-sm text-stone-600">{a.whyVisit}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-accent-700"
                  onClick={() => setEditing(a)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs font-medium text-red-600"
                  onClick={() => void remove(a.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={save} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <p className="mb-4 text-sm font-semibold text-ink">
          {editing ? `Editing: ${editing.name}` : "Add a place travellers will click"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="attr-name">Place name</Label>
            <Input
              id="attr-name"
              name="name"
              required
              key={editing?.id ?? "new"}
              defaultValue={editing?.name ?? ""}
              className="mt-1"
              placeholder="e.g. Gun Hill Point"
            />
          </div>
          <div>
            <Label htmlFor="attr-day">Day # (optional)</Label>
            <Input
              id="attr-day"
              name="dayNumber"
              type="number"
              min={1}
              defaultValue={editing?.dayNumber ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="attr-cat">Category</Label>
            <select
              id="attr-cat"
              name="category"
              defaultValue={editing?.category ?? "sightseeing"}
              className="mt-1 flex h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm"
            >
              {ATTRACTION_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="attr-tag">Short tagline</Label>
            <Input
              id="attr-tag"
              name="tagline"
              defaultValue={editing?.tagline ?? ""}
              className="mt-1"
              placeholder="Mussoorie’s iconic cable-car viewpoint"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="attr-why">Why visit (shown when pin is clicked)</Label>
            <textarea
              id="attr-why"
              name="whyVisit"
              rows={3}
              defaultValue={editing?.whyVisit ?? ""}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
              placeholder="What makes this place famous and worth the stop…"
            />
          </div>
          <div>
            <Label htmlFor="attr-lat">Latitude</Label>
            <Input
              id="attr-lat"
              name="latitude"
              type="number"
              step="any"
              defaultValue={editing?.latitude ?? ""}
              className="mt-1"
              placeholder="30.4591"
            />
          </div>
          <div>
            <Label htmlFor="attr-lng">Longitude</Label>
            <Input
              id="attr-lng"
              name="longitude"
              type="number"
              step="any"
              defaultValue={editing?.longitude ?? ""}
              className="mt-1"
              placeholder="78.0707"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="attr-img">Image URL</Label>
            <Input
              id="attr-img"
              name="imageUrl"
              defaultValue={editing?.imageUrl ?? ""}
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : editing ? "Update place" : "Add to map"}
          </Button>
          {editing ? (
            <button
              type="button"
              className="text-sm text-stone-600"
              onClick={() => setEditing(null)}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
