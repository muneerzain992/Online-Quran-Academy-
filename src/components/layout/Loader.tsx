"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Short first-visit splash — skipped after session or when reduced motion.
 */
export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    try {
      if (sessionStorage.getItem("dfha-loaded") === "1") return;
    } catch {
      /* ignore */
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("dfha-loaded", "1");
      } catch {
        /* ignore */
      }
    }, 420);

    return () => window.clearTimeout(timer);
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy/95 backdrop-blur-sm transition-opacity duration-300"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white shadow-[0_0_28px_rgb(30_90_255_/_0.35)] ring-1 ring-sky/30">
          <Image
            src={site.logo}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <p className="font-display text-sm text-muted">{site.shortName}</p>
      </div>
    </div>
  );
}
