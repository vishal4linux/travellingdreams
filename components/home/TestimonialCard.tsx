import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Props = {
  name: string;
  location: string | null;
  rating: number;
  trip: string | null;
  review: string;
};

export function TestimonialCard({ name, location, rating, trip, review }: Props) {
  return (
    <Card className="h-full border-border/80 bg-surface-elevated">
      <CardContent className="p-6">
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">&ldquo;{review}&rdquo;</p>
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-800">
            {name.charAt(0)}
          </span>
          <div>
          <p className="font-semibold text-ink">{name}</p>
          <p className="text-sm text-ink-subtle">
            {[location, trip].filter(Boolean).join(" · ")}
          </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
