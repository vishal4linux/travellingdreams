import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "border border-white/50 bg-gradient-to-b from-accent-400 to-accent-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_24px_-10px_rgba(234,88,12,0.7)] hover:from-accent-500 hover:to-accent-700 focus-visible:ring-accent-400",
  secondary:
    "glass text-ink hover:bg-white/70",
  ghost: "text-ink-muted hover:bg-white/45 hover:text-ink",
  outline:
    "border border-white/70 bg-white/25 text-brand-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md hover:bg-white/50",
  whatsapp:
    "border border-white/40 bg-[#25D366] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-10px_rgba(37,211,102,0.7)] hover:bg-[#1fb855]",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
  icon: "h-10 w-10 rounded-full",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
