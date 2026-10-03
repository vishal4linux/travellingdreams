import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-brand-100/80",
        className
      )}
      aria-hidden
    />
  );
}
