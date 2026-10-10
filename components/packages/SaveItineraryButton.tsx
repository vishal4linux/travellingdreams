"use client";

import { Download } from "lucide-react";

export function SaveItineraryButton({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <Download className="h-4 w-4" />
        Download itinerary
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={() => window.print()}>
      <Download className="h-4 w-4" />
      Save as PDF
    </button>
  );
}
