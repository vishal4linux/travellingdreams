"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = { id: string; name: string };

type PackageValues = {
  id?: string;
  title: string;
  slug?: string;
  destinationId: string;
  durationNights: number;
  durationDays: number;
  startingCity?: string | null;
  placesCovered?: string | null;
  meals?: string | null;
  transport?: string | null;
  highlights?: string | null;
  description?: string | null;
  inclusions?: string | null;
  exclusions?: string | null;
  cancellationPolicy?: string | null;
  terms?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  basePrice: number;
  theme?: string;
  heroImage?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
};

export function PackageEditor({
  destinations,
  initial,
}: {
  destinations: Destination[];
  initial?: PackageValues;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? ""),
      slug: String(fd.get("slug") ?? "") || undefined,
      destinationId: String(fd.get("destinationId") ?? ""),
      durationNights: Number(fd.get("durationNights") ?? 3),
      durationDays: Number(fd.get("durationDays") ?? 4),
      startingCity: String(fd.get("startingCity") ?? "") || null,
      placesCovered: String(fd.get("placesCovered") ?? "") || null,
      meals: String(fd.get("meals") ?? "") || null,
      transport: String(fd.get("transport") ?? "") || null,
      highlights: String(fd.get("highlights") ?? "") || null,
      description: String(fd.get("description") ?? "") || null,
      inclusions: String(fd.get("inclusions") ?? "") || null,
      exclusions: String(fd.get("exclusions") ?? "") || null,
      cancellationPolicy: String(fd.get("cancellationPolicy") ?? "") || null,
      terms: String(fd.get("terms") ?? "") || null,
      rating: fd.get("rating") ? Number(fd.get("rating")) : null,
      reviewCount: fd.get("reviewCount") ? Number(fd.get("reviewCount")) : 0,
      basePrice: Number(fd.get("basePrice") ?? 0),
      theme: String(fd.get("theme") ?? "ADVENTURE"),
      heroImage: String(fd.get("heroImage") ?? "") || null,
      isPublished: fd.get("isPublished") === "on",
      isFeatured: fd.get("isFeatured") === "on",
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/packages/${initial!.id}` : "/api/admin/packages",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push(`/admin/packages/${data.package.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-ink">
          {isEdit ? "Package details" : "Create a new package"}
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Pricing, story copy and publish settings travellers see on the site.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Package title</Label>
          <Input id="title" name="title" required defaultValue={initial?.title} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="destinationId">Primary destination</Label>
          <select
            id="destinationId"
            name="destinationId"
            required
            defaultValue={initial?.destinationId}
            className="mt-1 flex h-11 w-full rounded-xl border border-stone-200 px-3 text-sm"
          >
            <option value="">Select…</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="durationNights">Nights</Label>
          <Input
            id="durationNights"
            name="durationNights"
            type="number"
            min={1}
            required
            defaultValue={initial?.durationNights ?? 3}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="durationDays">Days</Label>
          <Input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            required
            defaultValue={initial?.durationDays ?? 4}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="basePrice">Base price (INR)</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            min={0}
            required
            defaultValue={initial?.basePrice ?? 9999}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="theme">Theme</Label>
          <select
            id="theme"
            name="theme"
            defaultValue={initial?.theme ?? "ADVENTURE"}
            className="mt-1 flex h-11 w-full rounded-xl border border-stone-200 px-3 text-sm"
          >
            {["ADVENTURE", "HONEYMOON", "FAMILY", "SPIRITUAL", "HERITAGE", "WEEKEND", "CUSTOM"].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="startingCity">Starting city</Label>
          <Input id="startingCity" name="startingCity" defaultValue={initial?.startingCity ?? ""} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="meals">Meals</Label>
          <Input id="meals" name="meals" defaultValue={initial?.meals ?? ""} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="placesCovered">Places covered</Label>
          <Input
            id="placesCovered"
            name="placesCovered"
            defaultValue={initial?.placesCovered ?? ""}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="transport">Transport</Label>
          <Input id="transport" name="transport" defaultValue={initial?.transport ?? ""} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="highlights">Highlights</Label>
          <textarea
            id="highlights"
            name="highlights"
            rows={4}
            defaultValue={initial?.highlights ?? ""}
            placeholder="One highlight per line"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="inclusions">Inclusions</Label>
          <textarea
            id="inclusions"
            name="inclusions"
            rows={4}
            defaultValue={initial?.inclusions ?? ""}
            placeholder="One inclusion per line"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="exclusions">Exclusions</Label>
          <textarea
            id="exclusions"
            name="exclusions"
            rows={4}
            defaultValue={initial?.exclusions ?? ""}
            placeholder="One exclusion per line"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="terms">Know before you go</Label>
          <textarea
            id="terms"
            name="terms"
            rows={5}
            defaultValue={initial?.terms ?? ""}
            placeholder="One point per line — GST, ID, permits, weather notes"
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cancellationPolicy">Cancellation policy</Label>
          <textarea
            id="cancellationPolicy"
            name="cancellationPolicy"
            rows={3}
            defaultValue={initial?.cancellationPolicy ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="rating">Guest rating (0–5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            step="0.1"
            defaultValue={initial?.rating ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reviewCount">Review count</Label>
          <Input
            id="reviewCount"
            name="reviewCount"
            type="number"
            min={0}
            defaultValue={initial?.reviewCount ?? 0}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="heroImage">Hero image URL</Label>
          <Input id="heroImage" name="heroImage" defaultValue={initial?.heroImage ?? ""} className="mt-1" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} />
          Featured on homepage
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : isEdit ? "Save package" : "Create package"}
      </Button>
    </form>
  );
}
