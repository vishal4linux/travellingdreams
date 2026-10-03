import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
