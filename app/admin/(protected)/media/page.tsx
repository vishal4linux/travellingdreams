"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

type Media = {
  id: string;
  url: string;
  alt: string | null;
  folder: string | null;
  createdAt: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    if (res.ok) setItems(data.items ?? []);
    else setError(data.error ?? "Failed to load");
  }

  useEffect(() => {
    void load();
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "media");
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(false);
    e.target.value = "";
    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this media file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    await load();
  }

  function copy(url: string) {
    void navigator.clipboard.writeText(url);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Media library</h1>
      <p className="mt-2 text-sm text-stone-600">
        Upload images, then paste the URL into hotel/package/destination forms.
      </p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
        <label className="text-sm font-medium">Upload image (max 5MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          className="mt-2 block w-full text-sm"
          onChange={(e) => void onUpload(e)}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image
                src={m.url}
                alt={m.alt ?? ""}
                fill
                className="object-cover"
                sizes="280px"
                unoptimized={m.url.startsWith("/")}
              />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-xs text-stone-500">{m.url}</p>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => copy(m.url)}>
                  Copy URL
                </Button>
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => void remove(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
