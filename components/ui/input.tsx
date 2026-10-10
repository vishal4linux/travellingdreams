import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "glass-field",
      "placeholder:text-ink-subtle",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300/80 focus-visible:border-white",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
    {...props}
  />
));
Label.displayName = "Label";
