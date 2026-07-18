"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function MagneticButton({
  children,
  href,
  className,
  strength = 0.35,
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "focus-ring inline-flex items-center justify-center rounded-xl bg-royal px-5 py-3 text-sm font-medium text-white shadow-[0_0_24px_rgb(30_90_255_/_0.35)] transition-colors hover:bg-royal/90",
    className,
  );

  const content = href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );

  const wrapperClass = cn(
    "will-change-transform",
    className?.includes("w-full") ? "block w-full" : "inline-block",
  );

  if (reduced) {
    return className?.includes("w-full") ? (
      <div className="block w-full">{content}</div>
    ) : (
      content
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={wrapperClass}
    >
      {content}
    </motion.div>
  );
}
