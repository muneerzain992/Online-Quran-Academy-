"use client";

import dynamic from "next/dynamic";
import { useCanRender3D } from "@/hooks/useCanRender3D";
import { HeroFallback } from "./HeroFallback";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);

const FloatingAccent = dynamic(
  () =>
    import("@/components/three/FloatingAccent").then((m) => m.FloatingAccent),
  { ssr: false },
);

/** Chooses lazy R3F hero or CSS fallback based on capability. */
export function HeroVisual() {
  const { ready, enabled } = useCanRender3D();

  if (!ready || !enabled) {
    return <HeroFallback />;
  }

  return <HeroScene />;
}

/** Optional decorative crystal for section accents (desktop-capable only). */
export function HeroAccent({ className }: { className?: string }) {
  const { ready, enabled } = useCanRender3D();
  if (!ready || !enabled) return null;
  return <FloatingAccent className={className} />;
}
