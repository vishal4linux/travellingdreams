import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = {
  title: string;
  description: string | null;
  badge: string | null;
  linkUrl: string | null;
};

export function OfferCard({ title, description, badge, linkUrl }: Props) {
  const href = linkUrl ?? "/offers";
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full border-brand-200/60 bg-gradient-to-br from-brand-50 to-surface-elevated">
        <CardContent>
          {badge ? <Badge className="mb-3 bg-brand-700 text-white">{badge}</Badge> : null}
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}
          <span className="mt-4 inline-block text-sm font-medium text-brand-700">
            View offer →
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
