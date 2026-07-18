"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setError(t("invalidCredentials"));
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-sky hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("signingIn") : t("signIn")}
      </Button>
      {process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true" ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl })}
        >
          {t("continueGoogle")}
        </Button>
      ) : null}
      <p className="text-center text-sm text-muted">
        {t("newHere")}{" "}
        <Link href="/register" className="text-sky hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
