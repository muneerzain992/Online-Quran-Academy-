"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";

function VerifyInner() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("Verifying…");

  useEffect(() => {
    if (!email || !token) {
      setStatus("err");
      setMessage("Missing verification details.");
      return;
    }
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    })
      .then(async (res) => {
        const json = (await res.json()) as { ok: boolean; message?: string };
        if (!res.ok || !json.ok) throw new Error(json.message ?? "Failed");
        setStatus("ok");
        setMessage(json.message ?? "Email verified.");
      })
      .catch((err: Error) => {
        setStatus("err");
        setMessage(err.message);
      });
  }, [email, token]);

  return (
    <Card className="mx-auto mt-16 max-w-md p-8 text-center">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Email verification
      </h1>
      <p
        className={`mt-4 text-sm ${status === "err" ? "text-red-400" : "text-muted"}`}
      >
        {message}
      </p>
      {status === "ok" ? (
        <Button href="/login" className="mt-6">
          Sign in
        </Button>
      ) : null}
      {status === "err" ? (
        <Link href="/register" className="mt-6 inline-block text-sm text-sky">
          Back to register
        </Link>
      ) : null}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-muted">Loading…</p>}>
      <VerifyInner />
    </Suspense>
  );
}
