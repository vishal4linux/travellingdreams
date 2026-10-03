import { z } from "zod";

export const packageSearchSchema = z.object({
  destination: z.string().optional(),
  duration: z.coerce.number().optional(),
  budget: z.coerce.number().optional(),
  theme: z.string().optional(),
  departure: z.string().optional(),
  hotelCategory: z.string().optional(),
  travelDate: z.string().optional(),
  adults: z.coerce.number().optional(),
  children: z.coerce.number().optional(),
});

export type PackageSearchFilters = z.infer<typeof packageSearchSchema>;

export function parsePackageSearchParams(
  raw: Record<string, string | string[] | undefined>
): PackageSearchFilters {
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  const parsed = packageSearchSchema.safeParse(flat);
  return parsed.success ? parsed.data : {};
}
