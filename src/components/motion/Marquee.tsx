"use client";

import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  separator?: ReactNode;
};

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
  separator = <span className="mx-6 text-gold/80">·</span>,
}: MarqueeProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 overflow-hidden py-3 text-sm text-muted",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden border-y border-border/60 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max items-center whitespace-nowrap text-sm text-muted animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        <div className="flex items-center px-4">
          {children}
          {separator}
        </div>
        <div className="flex items-center px-4" aria-hidden>
          {children}
          {separator}
        </div>
        <div className="flex items-center px-4" aria-hidden>
          {children}
          {separator}
        </div>
      </div>
    </div>
  );
}
