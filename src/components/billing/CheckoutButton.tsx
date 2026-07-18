"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

export function CheckoutButton({
  planName,
  popular,
  label = "Get Started",
}: {
  planName: "Basic" | "Standard" | "Premium";
  popular?: boolean;
  label?: string;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    setError("");
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/courses#pricing")}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        url?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.message ?? "Checkout unavailable");
      }
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full">
      <Button
        type="button"
        variant={popular ? "primary" : "secondary"}
        className="w-full"
        disabled={loading}
        onClick={onClick}
      >
        {loading ? "Redirecting…" : label}
      </Button>
      {error ? <p className="mt-2 text-center text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
