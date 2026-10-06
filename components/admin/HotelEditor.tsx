"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = { id: string; name: string };

type HotelValues = {
  id?: string;
  name: string;
  slug?: string;
  destinationId: string;
  brandPartner?: string | null;
  isLaRiqueza?: boolean;
  isFeatured?: boolean;
  starRating?: number;
  address: string;
  city: string;
  state: string;
  shortDescription?: string | null;
  description?: string | null;
  policies?: string | null;
  isPublished?: boolean;
  isBookable?: boolean;
  imageUrl?: string;
};

export function HotelEditor({
  destinations,
  initial,
}: {
  destinations: Destination[];
  initial?: HotelValues;
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
      name: String(fd.get("name") ?? ""),
      slug: String(fd.get("slug") ?? "") || undefined,
      destinationId: String(fd.get("destinationId") ?? ""),
      brandPartner: String(fd.get("brandPartner") ?? "") || undefined,
      isLaRiqueza: fd.get("isLaRiqueza") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      starRating: Number(fd.get("starRating") ?? 3),
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? ""),
      shortDescription: String(fd.get("shortDescription") ?? "") || null,
      description: String(fd.get("description") ?? "") || null,
      policies: String(fd.get("policies") ?? "") || null,
      isPublished: fd.get("isPublished") === "on",
      isBookable: fd.get("isBookable") === "on",
      imageUrl: !isEdit ? String(fd.get("imageUrl") ?? "") || undefined : undefined,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/hotels/${initial!.id}` : "/api/admin/hotels", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push(`/admin/hotels/${data.hotel.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Hotel name</Label>
          <Input id="name" name="name" required defaultValue={initial?.name} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="destinationId">Destination</Label>
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
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required defaultValue={initial?.city} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" required defaultValue={initial?.state} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" required defaultValue={initial?.address} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="brandPartner">Brand partner</Label>
          <Input
            id="brandPartner"
            name="brandPartner"
            defaultValue={initial?.brandPartner ?? "LA Riqueza Hotels"}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="starRating">Star rating</Label>
          <Input
            id="starRating"
            name="starRating"
            type="number"
            min={1}
            max={5}
            defaultValue={initial?.starRating ?? 4}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            defaultValue={initial?.shortDescription ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Full description</Label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initial?.description ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="policies">Policies</Label>
          <textarea
            id="policies"
            name="policies"
            rows={3}
            defaultValue={initial?.policies ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        {!isEdit ? (
          <div className="sm:col-span-2">
            <Label htmlFor="imageUrl">Hero image URL (optional)</Label>
            <Input id="imageUrl" name="imageUrl" placeholder="https://…" className="mt-1" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isLaRiqueza" defaultChecked={initial?.isLaRiqueza ?? true} />
          LA Riqueza
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured ?? false} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked={initial?.isPublished ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isBookable" defaultChecked={initial?.isBookable ?? true} />
          Bookable
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : isEdit ? "Save hotel" : "Create hotel"}
      </Button>
    </form>
  );
}
