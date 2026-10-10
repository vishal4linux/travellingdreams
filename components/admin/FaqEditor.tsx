"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Faq = { id: string; question: string; answer: string };

export function FaqEditor({ packageId, faqs }: { packageId: string; faqs: Faq[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Faq | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      question: String(fd.get("question") ?? ""),
      answer: String(fd.get("answer") ?? ""),
    };
    try {
      const url = editing
        ? `/api/admin/packages/${packageId}/faqs/${editing.id}`
        : `/api/admin/packages/${packageId}/faqs`;
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
    if (!confirm("Remove this question?")) return;
    setBusy(true);
    await fetch(`/api/admin/packages/${packageId}/faqs/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">FAQs</h2>
        <p className="mt-1 text-sm text-stone-600">
          These expand on the public package page, the same way travellers expect on a tour listing.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {faqs.map((faq) => (
          <li key={faq.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{faq.question}</p>
                <p className="mt-1 text-sm text-stone-600">{faq.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" className="text-xs font-medium text-accent-700" onClick={() => setEditing(faq)}>
                  Edit
                </button>
                <button type="button" className="text-xs font-medium text-red-600" onClick={() => void remove(faq.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <p className="text-sm font-semibold text-ink">
          {editing ? `Editing: ${editing.question}` : "Add a question"}
        </p>
        <div>
          <Label htmlFor="faq-q">Question</Label>
          <Input
            id="faq-q"
            name="question"
            required
            key={editing?.id ?? "new"}
            defaultValue={editing?.question ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="faq-a">Answer</Label>
          <textarea
            id="faq-a"
            name="answer"
            required
            rows={4}
            defaultValue={editing?.answer ?? ""}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : editing ? "Update FAQ" : "Add FAQ"}
          </Button>
          {editing ? (
            <button type="button" className="text-sm text-stone-600" onClick={() => setEditing(null)}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
