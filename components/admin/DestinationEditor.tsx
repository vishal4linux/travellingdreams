"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Destination = {
  id: string;
  name: string;
  slug: string;
  state: string | null;
  tagline: string | null;
  description: string | null;
  heroImage: string | null;
  cardImage: string | null;
  isPopular: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export function DestinationEditor({ destination }: { destination: Destination }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/destinations/${destination.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        slug: fd.get("slug"),
        state: fd.get("state") || null,
        tagline: fd.get("tagline") || null,
        description: fd.get("description") || null,
        heroImage: fd.get("heroImage") || null,
        cardImage: fd.get("cardImage") || null,
        sortOrder: Number(fd.get("sortOrder") ?? 0),
        isPopular: fd.get("isPopular") === "on",
        isPublished: fd.get("isPublished") === "on",
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button type="button" className="text-sm text-brand-700" onClick={() => setOpen(true)}>
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={save} className="mt-3 w-full space-y-2 rounded-lg border border-stone-100 bg-stone-50 p-3 text-left">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${destination.id}`}>Name</Label>
          <Input id={`name-${destination.id}`} name="name" defaultValue={destination.name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor={`slug-${destination.id}`}>Slug</Label>
          <Input id={`slug-${destination.id}`} name="slug" defaultValue={destination.slug} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor={`state-${destination.id}`}>State</Label>
          <Input id={`state-${destination.id}`} name="state" defaultValue={destination.state ?? ""} className="mt-1" />
        </div>
        <div>
          <Label htmlFor={`sort-${destination.id}`}>Sort order</Label>
          <Input
            id={`sort-${destination.id}`}
            name="sortOrder"
            type="number"
            defaultValue={destination.sortOrder}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`tagline-${destination.id}`}>Tagline</Label>
          <Input
            id={`tagline-${destination.id}`}
            name="tagline"
            defaultValue={destination.tagline ?? ""}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`card-${destination.id}`}>Card image URL</Label>
          <Input
            id={`card-${destination.id}`}
            name="cardImage"
            defaultValue={destination.cardImage ?? ""}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`hero-${destination.id}`}>Hero image URL</Label>
          <Input
            id={`hero-${destination.id}`}
            name="heroImage"
            defaultValue={destination.heroImage ?? ""}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`desc-${destination.id}`}>Description</Label>
          <textarea
            id={`desc-${destination.id}`}
            name="description"
            rows={3}
            defaultValue={destination.description ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPopular" defaultChecked={destination.isPopular} /> Popular
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked={destination.isPublished} /> Published
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={busy}>
          Save
        </Button>
        <button type="button" className="text-sm text-stone-600" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
