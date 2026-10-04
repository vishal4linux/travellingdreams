import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function HorizontalScrollRow({ children, className }: Props) {
  return (
    <div
      className={cn(
        "scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0",
        className
      )}
    >
      {children}
    </div>
  );
}
