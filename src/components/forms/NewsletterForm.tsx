"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { emailSchema } from "@/lib/validations";

export function NewsletterForm() {
  const t = useTranslations("Forms.newsletter");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Enter a valid email");
      setStatus("idle");
      return;
    }
    setFieldError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Failed");
      setMessage(json.message ?? "Subscribed.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Could not subscribe right now.",
      );
      setStatus("error");
    }
  };

  return (
    <form className="space-y-2 pt-2" aria-label={t("label")} onSubmit={onSubmit} noValidate>
      <label htmlFor="footer-email" className="sr-only">
        {t("label")}
      </label>
      <div className="flex gap-2">
        <input
          id="footer-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError) setFieldError("");
          }}
          placeholder={t("placeholder")}
          disabled={status === "loading"}
          aria-invalid={!!fieldError}
          className="focus-ring w-full rounded-xl border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-muted disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="focus-ring shrink-0 rounded-xl bg-royal px-3 py-2 text-sm font-medium text-white hover:bg-royal/90 disabled:opacity-70"
        >
          {status === "loading" ? t("loading") : t("joinShort")}
        </button>
      </div>
      {fieldError ? (
        <p role="alert" className="text-[11px] text-red-400">
          {fieldError}
        </p>
      ) : status === "success" || status === "error" ? (
        <p
          role="status"
          className={`text-[11px] ${status === "success" ? "text-cyan" : "text-red-400"}`}
        >
          {message}
        </p>
      ) : (
        <p className="text-[11px] text-muted">{t("hint")}</p>
      )}
    </form>
  );
}
