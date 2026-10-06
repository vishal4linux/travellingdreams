"use client";

import { AttractionsEditor } from "@/components/admin/AttractionsEditor";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageManager } from "@/components/admin/ImageManager";
import { ItineraryEditor } from "@/components/admin/ItineraryEditor";
import { PackageEditor } from "@/components/admin/PackageEditor";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Camera,
  Eye,
  Map,
  Route,
  Settings2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Tab = "overview" | "gallery" | "itinerary" | "places" | "publish";

const TABS: { id: Tab; label: string; icon: typeof Settings2 }[] = [
  { id: "overview", label: "Overview", icon: Settings2 },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "itinerary", label: "Day itinerary", icon: Route },
  { id: "places", label: "Map places", icon: Map },
  { id: "publish", label: "Publish & SEO", icon: Sparkles },
];

type Props = {
  packageId: string;
  title: string;
  publicPath: string | null;
  priceLabel: string;
  isPublished: boolean;
  isFeatured: boolean;
  imageCount: number;
  dayCount: number;
  placeCount: number;
  destinations: { id: string; name: string }[];
  editorInitial: Parameters<typeof PackageEditor>[0]["initial"];
  images: { id: string; url: string; alt?: string | null }[];
  itineraryDays: Parameters<typeof ItineraryEditor>[0]["days"];
  attractions: Parameters<typeof AttractionsEditor>[0]["attractions"];
};

export function PackageStudio(props: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="space-y-6">
      {/* Studio header */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 md:p-8">
          <div className="max-w-2xl">
            <Link
              href="/admin/packages"
              className="text-xs font-semibold uppercase tracking-wider text-brand-200 hover:text-white"
            >
              ← All packages
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{props.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1">{props.priceLabel}</span>
              <span
                className={cn(
                  "rounded-full px-3 py-1",
                  props.isPublished ? "bg-emerald-500/25 text-emerald-100" : "bg-amber-500/25 text-amber-100"
                )}
              >
                {props.isPublished ? "Live on website" : "Draft"}
              </span>
              {props.isFeatured ? (
                <span className="rounded-full bg-accent-500/30 px-3 py-1 text-accent-100">
                  Featured
                </span>
              ) : null}
              <span className="rounded-full bg-white/10 px-3 py-1">
                {props.dayCount} days · {props.placeCount} map places · {props.imageCount} photos
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {props.publicPath ? (
              <ButtonLink
                href={props.publicPath}
                variant="secondary"
                size="sm"
                className="bg-white text-brand-900"
              >
                <Eye className="h-4 w-4" />
                Preview live
              </ButtonLink>
            ) : null}
            <DeleteButton
              url={`/api/admin/packages/${props.packageId}`}
              redirectTo="/admin/packages"
              confirmMessage={`Delete "${props.title}" permanently?`}
              className="rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-red-500/30 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="scrollbar-hide flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 md:px-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                tab === id
                  ? "bg-accent-500 text-white shadow-md"
                  : "text-brand-100 hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Guidance strip */}
      <div className="rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-brand-950">
        {tab === "overview" &&
          "Fill the story travellers see first — title, price, meals, highlights and destination."}
        {tab === "gallery" &&
          "Upload photos or paste Unsplash URLs. First image becomes the hero when empty."}
        {tab === "itinerary" &&
          "Add each day with location + coordinates so overnight stops show on the route."}
        {tab === "places" &&
          "This is the magic: clickable famous places on the animated map (why visit, tip, photo)."}
        {tab === "publish" &&
          "Toggle Featured / Published and refine SEO fields in Overview before going live."}
      </div>

      <div className="min-h-[420px]">
        {tab === "overview" || tab === "publish" ? (
          <PackageEditor destinations={props.destinations} initial={props.editorInitial} />
        ) : null}
        {tab === "gallery" ? (
          <ImageManager
            label="Package gallery"
            images={props.images}
            uploadUrl={`/api/admin/packages/${props.packageId}/images`}
          />
        ) : null}
        {tab === "itinerary" ? (
          <ItineraryEditor packageId={props.packageId} days={props.itineraryDays} />
        ) : null}
        {tab === "places" ? (
          <AttractionsEditor packageId={props.packageId} attractions={props.attractions} />
        ) : null}
      </div>
    </div>
  );
}
