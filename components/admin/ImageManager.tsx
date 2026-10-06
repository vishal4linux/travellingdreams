"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ImageRow = { id: string; url: string; alt?: string | null; isPrimary?: boolean };

type Props = {
  images: ImageRow[];
  uploadUrl: string;
  onDeleted?: () => void;
  label?: string;
};

export function ImageManager({ images, uploadUrl, onDeleted, label = "Images" }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function uploadFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      router.refresh();
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addUrl() {
    if (!url.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setUrl("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(imageId: string) {
    if (!confirm("Remove this image?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${uploadUrl}/${imageId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.refresh();
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="font-display text-xl font-semibold">{label}</h2>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-lg border border-stone-200">
            <div className="relative aspect-[4/3] bg-stone-100">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="240px" unoptimized={img.url.startsWith("/")} />
            </div>
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs text-stone-500">
                {img.isPrimary ? "Primary · " : ""}
                {img.url}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(img.id)}
                className="shrink-0 text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
        <div>
          <label className="text-sm font-medium text-stone-700">Upload from computer</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={busy}
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadFile(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Or paste image URL (https://…)"
            className="min-w-[220px] flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
          />
          <Button type="button" disabled={busy || !url.trim()} onClick={() => void addUrl()}>
            Add URL
          </Button>
        </div>
      </div>
    </section>
  );
}
