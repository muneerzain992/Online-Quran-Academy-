"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  mode?: "words" | "lines";
};

export function TextReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  mode = "words",
}: TextRevealProps) {
  const reduced = usePrefersReducedMotion();
  const Tag = as;
  const parts =
    mode === "words" ? text.split(" ") : text.split("\n").filter(Boolean);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("overflow-hidden", className)} aria-label={text}>
      <motion.span
        className="flex flex-wrap"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5% 0px" }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.04, delayChildren: delay },
          },
        }}
        aria-hidden
      >
        {parts.map((part, i) => (
          <span key={`${part}-${i}`} className="overflow-hidden">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {part}
              {mode === "words" && i < parts.length - 1 ? "\u00A0" : null}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
