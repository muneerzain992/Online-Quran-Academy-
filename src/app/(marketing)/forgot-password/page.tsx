"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PageHero } from "@/components/layout";
import { Button, Card, Input } from "@/components/ui";
import { emailSchema } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }
    setFieldError("");
    setLoading(true);
    setMessage("");
    setPreview("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        emailPreviewUrl?: string;
      };
      setMessage(json.message ?? "Check your inbox.");
      if (json.emailPreviewUrl) setPreview(json.emailPreviewUrl);
    } catch {
      setMessage("Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("forgotPassword")}
        description={t("forgotDesc")}
      />
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Input
              label={t("email")}
              type="email"
              placeholder="name@gmail.com"
              value={email}
              error={fieldError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError("");
              }}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("loading") : t("sendResetBtn")}
            </Button>
          </form>
          {message ? <p className="mt-4 text-sm text-cyan">{message}</p> : null}
          {preview ? (
            <p className="mt-2 text-xs text-muted">
              Dev preview:{" "}
              <a href={preview} target="_blank" rel="noreferrer" className="text-sky">
                Open email
              </a>
            </p>
          ) : null}
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/login" className="text-sky hover:underline">
              {t("backToSignIn")}
            </Link>
          </p>
        </Card>
      </section>
    </>
  );
}
