const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const row = buckets.get(key);
  if (!row || now > row.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  if (row.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((row.reset - now) / 1000) };
  }
  row.count += 1;
  return { ok: true };
}
