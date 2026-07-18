"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

function isLowPowerDevice() {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const saveData = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData;
  const narrow = window.matchMedia("(max-width: 640px)").matches;
  if (saveData) return true;
  if (memory !== undefined && memory <= 2) return true;
  if (narrow && cores <= 4) return true;
  return false;
}

/**
 * Gates heavy R3F scenes. Falls back when motion is reduced,
 * WebGL is missing, or the device looks power-constrained.
 */
export function useCanRender3D() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasWebGL() && !isLowPowerDevice());
    setReady(true);
  }, []);

  return {
    ready,
    /** True only when 3D should mount */
    enabled: ready && !reduced && allowed,
    reduced,
  };
}
