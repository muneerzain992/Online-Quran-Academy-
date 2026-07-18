"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

type CursorParallaxProps = {
  children: ReactNode;
  strength?: number;
};

/** Tilts the whole scene group toward the pointer. */
export function CursorParallax({
  children,
  strength = 0.35,
}: CursorParallaxProps) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const tx = state.pointer.x * strength;
    const ty = state.pointer.y * strength * 0.6;
    group.current.rotation.y += (tx - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (-ty - group.current.rotation.x) * 0.06;
  });

  return <group ref={group}>{children}</group>;
}
