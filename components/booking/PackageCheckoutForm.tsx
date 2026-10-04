"use client";

import { GuestCheckoutForm } from "@/components/booking/GuestCheckoutForm";
import { Label } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { useMemo, useState } from "react";

export type DepartureOption = {
  id: string;
  startDate: string;
  seatsLeft: number;
};

const DEFAULT_ADDONS = [
  { name: "Travel insurance", price: 899 },
  { name: "Airport pickup", price: 1500 },
];

type Props = {
  destinationSlug: string;
  packageSlug: string;
  travelDate: string;
  adults: number;
  childCount: number;
  label: string;
  baseTotal: number;
  summaryLines: string[];
  departures: DepartureOption[];
};

export function PackageCheckoutForm({
  destinationSlug,
  packageSlug,
  travelDate,
  adults,
  childCount,
  label,
  baseTotal,
  summaryLines,
  departures,
}: Props) {
  const [departureDateId, setDepartureDateId] = useState(departures[0]?.id ?? "");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

  const addOnTotal = useMemo(
    () =>
      DEFAULT_ADDONS.filter((a) => selectedAddOns[a.name]).reduce((s, a) => s + a.price, 0),
    [selectedAddOns]
  );

  const total = baseTotal + addOnTotal;
  const addOnsPayload = DEFAULT_ADDONS.filter((a) => selectedAddOns[a.name]).map((a) => ({
    name: a.name,
    price: a.price,
  }));

  const lines = [
    ...summaryLines,
    ...(addOnTotal ? [`Add-ons ${formatINR(addOnTotal)}`] : []),
  ];

  return (
    <div className="space-y-8">
      {departures.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface-elevated p-5">
          <h2 className="font-display text-xl font-semibold">Fixed departure</h2>
          <p className="mt-1 text-sm text-ink-muted">Optional — select a group departure with limited seats.</p>
          <div className="mt-4">
            <Label htmlFor="departure">Departure date</Label>
            <select
              id="departure"
              value={departureDateId}
              onChange={(e) => setDepartureDateId(e.target.value)}
              className="mt-1.5 flex h-11 w-full max-w-md rounded-xl border border-border px-3 text-sm"
            >
              <option value="">Flexible date ({travelDate})</option>
              {departures.map((d) => (
                <option key={d.id} value={d.id} disabled={d.seatsLeft < adults + childCount}>
                  {d.startDate} · {d.seatsLeft} seats left
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-surface-elevated p-5">
        <h2 className="font-display text-xl font-semibold">Optional add-ons</h2>
        <ul className="mt-4 space-y-3">
          {DEFAULT_ADDONS.map((a) => (
            <li key={a.name} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`addon-${a.name}`}
                checked={!!selectedAddOns[a.name]}
                onChange={(e) =>
                  setSelectedAddOns((prev) => ({ ...prev, [a.name]: e.target.checked }))
                }
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor={`addon-${a.name}`} className="flex flex-1 justify-between text-sm">
                <span>{a.name}</span>
                <span className="text-ink-muted">{formatINR(a.price)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <GuestCheckoutForm
        apiPath="/api/bookings/package"
        payload={{
          destinationSlug,
          packageSlug,
          travelDate: departureDateId
            ? departures.find((d) => d.id === departureDateId)?.startDate ?? travelDate
            : travelDate,
          departureDateId: departureDateId || undefined,
          adults,
          children: childCount,
          addOns: addOnsPayload.length ? addOnsPayload : undefined,
        }}
        summary={{ label, total, lines }}
      />
    </div>
  );
}
