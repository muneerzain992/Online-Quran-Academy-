"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = (await res.json()) as {
        ok: boolean;
        url?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.message ?? "Portal unavailable");
      }
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="button" variant="secondary" onClick={onClick} disabled={loading}>
        {loading ? "Opening…" : "Manage billing"}
      </Button>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
