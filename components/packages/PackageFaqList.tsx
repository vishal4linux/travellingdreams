"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function PackageFaqList({
  faqs,
}: {
  faqs: { id: string; question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <ul className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <li key={faq.id} className="glass overflow-hidden rounded-3xl">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-ink">{faq.question}</span>
              <ChevronDown className={cn("h-5 w-5 shrink-0 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen ? (
              <p className="border-t border-white/50 px-5 py-4 text-sm leading-relaxed text-ink-muted">
                {faq.answer}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
