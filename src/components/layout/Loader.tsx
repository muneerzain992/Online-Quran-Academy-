"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Premium first-load curtain — particles + monogram reveal.
 */
export function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [wipe, setWipe] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setProgress(100);
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1100;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(t * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setWipe(true);
        window.setTimeout(() => setVisible(false), 520);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-navy"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-90" />

      {!reduced
        ? Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-sky"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 29) % 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -24 - (i % 5) * 6],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))
        : null}

      <motion.div
        className="relative flex flex-col items-center gap-6"
        initial={reduced ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative h-24 w-24 overflow-hidden rounded-full bg-white shadow-[0_0_40px_rgb(30_90_255_/_0.45)] ring-2 ring-sky/30"
          animate={reduced ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={96}
            height={96}
            className="h-full w-full object-cover"
            priority
          />
        </motion.div>
        <p className="max-w-xs text-center font-display text-sm text-muted">
          {site.name}
        </p>
        <div
          className="h-1 w-44 overflow-hidden rounded-full bg-white/10"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-royal via-sky to-cyan transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="sr-only">{progress}% loaded</span>
      </motion.div>

      {wipe ? (
        <motion.div
          className="pointer-events-none absolute inset-0 origin-top bg-background"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        />
      ) : null}
    </div>
  );
}
