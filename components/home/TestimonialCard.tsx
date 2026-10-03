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
    <Card className="h-full bg-surface-elevated">
      <CardContent>
        <div className="flex gap-0.5 text-brand-500">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">&ldquo;{review}&rdquo;</p>
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-medium text-ink">{name}</p>
          <p className="text-sm text-ink-subtle">
            {[location, trip].filter(Boolean).join(" · ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
