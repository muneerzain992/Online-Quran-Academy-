"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Static / CSS fallback when WebGL or motion is unavailable. */
export function HeroFallback() {
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 40, damping: 18 });
  const springY = useSpring(my, { stiffness: 40, damping: 18 });
  const rotateX = useTransform(springY, [-40, 40], [8, -8]);
  const rotateY = useTransform(springX, [-40, 40], [-10, 10]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgb(30_90_255_/_0.35),transparent_65%)] blur-2xl" />
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgb(34_211_238_/_0.25),transparent_55%)]" />

      <motion.div
        style={
          reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }
        }
        className="relative flex h-full items-center justify-center"
      >
        <motion.div
          animate={reduced ? undefined : { rotate: 360, y: [0, -10, 0] }}
          transition={
            reduced
              ? undefined
              : {
                  rotate: { duration: 48, repeat: Infinity, ease: "linear" },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }
          }
          className="relative h-[78%] w-[78%]"
        >
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-[0_0_40px_rgb(56_189_248_/_0.35)]"
          >
            <defs>
              <linearGradient
                id="hero-ring-fallback"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#1E5AFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1.5"
              opacity="0.55"
            />
            <circle
              cx="100"
              cy="100"
              r="68"
              fill="none"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.4"
            />
            {[0, 45, 90, 135].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <path
                  d="M100 28 L112 52 L100 46 L88 52 Z"
                  fill="url(#hero-ring-fallback)"
                  opacity="0.85"
                />
                <path
                  d="M100 148 L108 168 L100 162 L92 168 Z"
                  fill="#E8B923"
                  opacity="0.55"
                />
              </g>
            ))}
            <rect
              x="62"
              y="72"
              width="76"
              height="56"
              rx="6"
              fill="rgb(13 27 62 / 0.85)"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1.5"
            />
            <path
              d="M70 88 H130 M70 100 H120 M70 112 H110"
              stroke="#93A4C7"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <text
              x="100"
              y="108"
              textAnchor="middle"
              fill="#E8EEFF"
              fontSize="10"
              fontFamily="var(--font-amiri), serif"
              opacity="0.9"
            >
              قرآن
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
