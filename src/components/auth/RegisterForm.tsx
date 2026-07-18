"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    setInfo("");
    setPreview("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        emailPreviewUrl?: string;
        errors?: { fieldErrors?: Record<string, string[]> };
      };
      if (!res.ok || !json.ok) {
        const fieldMsg = json.errors?.fieldErrors
          ? Object.values(json.errors.fieldErrors).flat()[0]
          : undefined;
        throw new Error(json.message ?? fieldMsg ?? "Registration failed");
      }
      setInfo(json.message ?? "Account created.");
      if (json.emailPreviewUrl) setPreview(json.emailPreviewUrl);

      const login = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label={t("fullName")}
        autoComplete="name"
        placeholder="Letters only (any language)"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        placeholder="name@gmail.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("password")}
        type="password"
        autoComplete="new-password"
        placeholder="Min 8 chars · letters, number, special"
        error={errors.password?.message}
        {...register("password")}
      />
      <p className="text-[11px] text-muted">{t("passwordRules")}</p>
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {info ? <p className="text-sm text-cyan">{info}</p> : null}
      {preview ? (
        <p className="text-xs text-muted">
          Dev email preview:{" "}
          <a href={preview} target="_blank" rel="noreferrer" className="text-sky">
            Open welcome email
          </a>
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("creating") : t("createAccount")}
      </Button>
      <p className="text-center text-sm text-muted">
        {t("alreadyHave")}{" "}
        <Link href="/login" className="text-sky hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
