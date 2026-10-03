const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse YYYY-MM-DD as UTC date-only. */
export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Hotel stay nights: check-in inclusive, check-out exclusive. */
export function eachNight(checkIn: Date, checkOut: Date): Date[] {
  if (checkOut <= checkIn) return [];
  const nights: Date[] = [];
  for (let t = checkIn.getTime(); t < checkOut.getTime(); t += DAY_MS) {
    nights.push(new Date(t));
  }
  return nights;
}

export function validateStayRange(checkIn: string, checkOut: string): {
  ok: boolean;
  nights: Date[];
  error?: string;
} {
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  if (!start || !end) {
    return { ok: false, nights: [], error: "Invalid date format." };
  }
  const nights = eachNight(start, end);
  if (nights.length === 0) {
    return { ok: false, nights: [], error: "Check-out must be after check-in." };
  }
  if (nights.length > 30) {
    return { ok: false, nights: [], error: "Maximum stay is 30 nights online." };
  }
  const today = parseDateOnly(formatDateOnly(new Date()));
  if (today && start < today) {
    return { ok: false, nights: [], error: "Check-in cannot be in the past." };
  }
  return { ok: true, nights };
}

export function countNights(checkIn: string, checkOut: string): number {
  const v = validateStayRange(checkIn, checkOut);
  return v.ok ? v.nights.length : 0;
}
