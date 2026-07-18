"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHero } from "@/components/layout";
import { Button, Card, Input } from "@/components/ui";
import { passwordSchema } from "@/lib/validations";

function ResetInner() {
  const t = useTranslations("Auth");
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }
    setFieldError("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password: parsed.data }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Failed");
      setMessage(json.message ?? "Password updated.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <Card className="p-8 text-center text-sm text-red-400">
        {t("invalidResetLink")}{" "}
        <Link href="/forgot-password" className="text-sky">
          {t("requestNewLink")}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label={t("newPassword")}
          type="password"
          placeholder="Min 8 chars · letters, number, special"
          value={password}
          error={fieldError}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldError) setFieldError("");
          }}
        />
        <p className="text-[11px] text-muted">{t("passwordRules")}</p>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-cyan">{message}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("updating") : t("updatePassword")}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations("Auth");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("resetPassword")} />
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Suspense fallback={<p className="text-muted">{t("loading")}</p>}>
          <ResetInner />
        </Suspense>
      </section>
    </>
  );
}
