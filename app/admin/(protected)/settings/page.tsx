"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useEffect, useState } from "react";

const LABELS: Record<string, string> = {
  homepage_hero_title: "Homepage hero title",
  homepage_hero_subtitle: "Homepage hero subtitle",
  homepage_partner_tagline: "Partner tagline (hero badge)",
  contact_phone: "Contact phone",
  contact_email: "Contact email",
  whatsapp_number: "WhatsApp number (digits, e.g. 919810965967)",
  footer_blurb: "Footer blurb",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.keys) setKeys(data.keys);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    setSettings(data.settings ?? settings);
    setMessage("Website content settings saved.");
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Website content</h1>
      <p className="mt-2 text-sm text-stone-600">
        Edit homepage hero text, contact details and footer copy used across the site.
      </p>
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <form onSubmit={save} className="mt-6 max-w-2xl space-y-4 rounded-xl border border-stone-200 bg-white p-6">
        {keys.map((key) => (
          <div key={key}>
            <Label htmlFor={key}>{LABELS[key] ?? key}</Label>
            {key.includes("blurb") || key.includes("subtitle") ? (
              <textarea
                id={key}
                rows={3}
                value={settings[key] ?? ""}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm"
              />
            ) : (
              <Input
                id={key}
                value={settings[key] ?? ""}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                className="mt-1"
              />
            )}
          </div>
        ))}
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
