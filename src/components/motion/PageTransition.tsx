"use client";

import type { ReactNode } from "react";

/** Pass-through — route waits were costing first paint and navigation feel. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
