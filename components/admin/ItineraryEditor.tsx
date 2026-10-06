"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Day = {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  meals?: string | null;
  stay?: string | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
};

export function ItineraryEditor({ packageId, days }: { packageId: string; days: Day[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addDay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      dayNumber: Number(fd.get("dayNumber")),
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      meals: String(fd.get("meals") ?? "") || null,
      stay: String(fd.get("stay") ?? "") || null,
      locationName: String(fd.get("locationName") ?? "") || null,
      latitude: fd.get("latitude") ? Number(fd.get("latitude")) : null,
      longitude: fd.get("longitude") ? Number(fd.get("longitude")) : null,
      imageUrl: String(fd.get("imageUrl") ?? "") || null,
    };
    try {
      const res = await fetch(`/api/admin/packages/${packageId}/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeDay(dayId: string) {
    if (!confirm("Delete this day?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/packages/${packageId}/itinerary/${dayId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const nextDay = (days.reduce((m, d) => Math.max(m, d.dayNumber), 0) || 0) + 1;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">Day-by-day itinerary</h2>
        <p className="mt-1 text-sm text-stone-600">
          Add overnight coordinates so the public journey map can draw the route between stays.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <ol className="space-y-3">
        {days.map((d) => (
          <li
            key={d.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  Day {d.dayNumber}: {d.title}
                </p>
                <p className="mt-1 text-sm text-stone-600">{d.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-500">
                  {d.locationName ? <span>📍 {d.locationName}</span> : null}
                  {d.latitude != null && d.longitude != null ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      on map
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                      add lat/lng
                    </span>
                  )}
                  {d.meals ? <span>🍽 {d.meals}</span> : null}
                  {d.stay ? <span>🛏 {d.stay}</span> : null}
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void removeDay(d.id)}
                className="text-xs font-medium text-red-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>

      <form
        onSubmit={addDay}
        className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm font-semibold text-ink">Add or update a day</p>
        <div>
          <Label htmlFor="dayNumber">Day #</Label>
          <Input
            id="dayNumber"
            name="dayNumber"
            type="number"
            min={1}
            defaultValue={nextDay}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="locationName">Overnight / city</Label>
          <Input id="locationName" name="locationName" className="mt-1" placeholder="Mussoorie" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            className="mt-1"
            placeholder="30.4598"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            className="mt-1"
            placeholder="78.0664"
          />
        </div>
        <div>
          <Label htmlFor="meals">Meals</Label>
          <Input id="meals" name="meals" className="mt-1" placeholder="Breakfast, Dinner" />
        </div>
        <div>
          <Label htmlFor="stay">Stay</Label>
          <Input id="stay" name="stay" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="imageUrl">Day image URL</Label>
          <Input id="imageUrl" name="imageUrl" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Add / update day"}
          </Button>
        </div>
      </form>
    </section>
  );
}
