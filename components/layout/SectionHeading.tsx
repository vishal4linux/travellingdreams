import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  /** Word(s) in title rendered with accent italic emphasis */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

function TitleWithAccent({ title, accent }: { title: string; accent?: string }) {
  if (!accent || !title.includes(accent)) {
    return <>{title}</>;
  }
  const [before, after] = title.split(accent);
  return (
    <>
      {before}
      <span className="font-display italic text-accent-600">{accent}</span>
      {after}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
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
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl text-balance">
        <TitleWithAccent title={title} accent={titleAccent} />
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-ink-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
