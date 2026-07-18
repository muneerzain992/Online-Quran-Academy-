import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
};

export function Card({
  children,
  className,
  hover = false,
  glass = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        glass ? "glass" : "border border-border bg-surface",
        hover &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:border-sky/30",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-sm leading-relaxed text-muted", className)}>
      {children}
    </p>
  );
}
