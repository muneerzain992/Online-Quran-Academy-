"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Textarea } from "@/components/ui";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function ContactForm() {
  const t = useTranslations("Forms.contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Failed");
      setServerMessage(json.message ?? t("success"));
      setStatus("success");
      reset();
    } catch (err) {
      setServerMessage(
        err instanceof Error ? err.message : t("error"),
      );
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("name")}
          autoComplete="name"
          placeholder={t("namePlaceholder")}
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              label={t("phoneOptional")}
              name={field.name}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={field.onChange}
              error={errors.phone?.message}
            />
          )}
        />
        <Input
          label={t("subject")}
          placeholder={t("subjectPlaceholder")}
          error={errors.subject?.message}
          {...register("subject")}
        />
      </div>
      <Textarea
        label={t("message")}
        rows={5}
        placeholder={t("messagePlaceholder")}
        error={errors.message?.message}
        {...register("message")}
      />

      {status !== "idle" ? (
        <p
          role="status"
          className={
            status === "success" ? "text-sm text-cyan" : "text-sm text-red-400"
          }
        >
          {serverMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
