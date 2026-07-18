"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  label?: string;
};

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1600,
  className,
  label,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <div className={cn("text-center", className)}>
      <span
        ref={ref}
        className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      >
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </span>
      {label ? (
        <p className="mt-2 px-1 text-xs leading-snug text-muted sm:text-sm">
          {label}
        </p>
      ) : null}
    </div>
  );
}
