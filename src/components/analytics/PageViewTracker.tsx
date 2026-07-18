"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    const body = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/pageview",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      void fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  }, [pathname]);

  return null;
}
