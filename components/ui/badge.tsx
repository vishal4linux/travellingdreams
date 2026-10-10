import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/70 bg-white/55 px-2.5 py-0.5 text-xs font-medium text-brand-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md",
        className
      )}
    >
      {children}
    </span>
  );
}
