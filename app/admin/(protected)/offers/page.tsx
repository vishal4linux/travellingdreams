"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Offer = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  badge: string | null;
  linkUrl: string | null;
  isActive: boolean;
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/offers");
    const data = await res.json();
    if (res.ok) setOffers(data.offers ?? []);
    else setError(data.error ?? "Failed to load");
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description") || null,
        image: fd.get("image") || null,
        badge: fd.get("badge") || null,
        linkUrl: fd.get("linkUrl") || null,
        isActive: true,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Create failed");
      return;
    }
    e.currentTarget.reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggle(id: string, isActive: boolean) {
    await fetch(`/api/admin/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Offers</h1>
      <p className="mt-2 text-sm text-stone-600">Homepage and offers page content.</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-6 space-y-3">
        {offers.map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">
                {o.title}{" "}
                {o.badge ? (
                  <span className="text-xs text-amber-700">[{o.badge}]</span>
                ) : null}
              </p>
              <p className="text-sm text-stone-600">
                {o.isActive ? "Active" : "Hidden"} · {o.image ? "has image" : "no image"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm text-brand-700"
                onClick={() => void toggle(o.id, o.isActive)}
              >
                {o.isActive ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() => void remove(o.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={create} className="mt-8 space-y-3 rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="font-semibold">Add offer</h2>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="badge">Badge</Label>
          <Input id="badge" name="badge" placeholder="Save 15%" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input id="linkUrl" name="linkUrl" placeholder="/packages" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" disabled={busy}>
          Create offer
        </Button>
      </form>
    </div>
  );
}
