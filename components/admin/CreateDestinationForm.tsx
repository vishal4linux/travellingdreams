"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateDestinationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [tagline, setTagline] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, state: state || undefined, tagline: tagline || undefined, isPopular: false }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    setName("");
    setState("");
    setTagline("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-4">
      <div>
        <Label htmlFor="destName">Name</Label>
        <Input id="destName" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="destState">State</Label>
        <Input id="destState" value={state} onChange={(e) => setState(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="destTag">Tagline</Label>
        <Input id="destTag" value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Add destination
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600 md:col-span-4">{String(error)}</p> : null}
    </form>
  );
}
