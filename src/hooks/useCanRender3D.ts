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

function shouldSkip3D() {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const saveData = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData;
  const mobile = window.matchMedia("(max-width: 1023px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (saveData) return true;
  if (mobile || coarse) return true;
  if (memory !== undefined && memory <= 4) return true;
  if (cores <= 4) return true;
  return false;
}

/**
 * Gates heavy R3F scenes. Off by default on mobile / low-power devices.
 * Defers enable until idle so first paint stays light.
 */
export function useCanRender3D() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (reduced || shouldSkip3D() || !hasWebGL()) {
      setAllowed(false);
      setReady(true);
      return;
    }

    let cancelled = false;
    const enable = () => {
      if (!cancelled) {
        setAllowed(true);
        setReady(true);
      }
    };

    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      const id = ric(enable, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timer = globalThis.setTimeout(enable, 600);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timer);
    };
  }, [reduced]);

  return {
    ready,
    enabled: ready && !reduced && allowed,
    reduced,
  };
}
