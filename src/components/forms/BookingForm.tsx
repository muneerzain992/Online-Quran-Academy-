"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select } from "@/components/ui";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const countryOptions = [
  { value: "", label: "" },
  { value: "UK", label: "United Kingdom" },
  { value: "USA", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Bahrain", label: "Bahrain" },
  { value: "Qatar", label: "Qatar" },
  { value: "Oman", label: "Oman" },
  { value: "Other", label: "Other" },
];

const timezoneOptions = [
  { value: "", label: "" },
  { value: "Europe/London", label: "UK (London)" },
  { value: "America/New_York", label: "USA (Eastern)" },
  { value: "America/Chicago", label: "USA (Central)" },
  { value: "America/Los_Angeles", label: "USA (Pacific)" },
  { value: "America/Toronto", label: "Canada (Toronto)" },
  { value: "Asia/Riyadh", label: "Saudi Arabia (Riyadh)" },
  { value: "Asia/Bahrain", label: "Bahrain" },
  { value: "Asia/Qatar", label: "Qatar" },
  { value: "Asia/Muscat", label: "Oman (Muscat)" },
  { value: "Other", label: "Other / flexible" },
];

const stepFields: Record<number, (keyof BookingInput)[]> = {
  1: ["studentName", "parentName", "email", "whatsapp"],
  2: [
    "country",
    "timezone",
    "courseSlug",
    "preferredTime",
    "teacherGenderPref",
  ],
  3: [],
};

export function BookingForm() {
  const t = useTranslations("Forms.booking");
  const tSteps = useTranslations("Book.steps");
  const tSite = useTranslations("Site");
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "" }]);
  const reduced = usePrefersReducedMotion();

  const steps = useMemo(
    () => [
      { id: 1, title: tSteps("student") },
      { id: 2, title: tSteps("course") },
      { id: 3, title: tSteps("confirm") },
    ],
    [tSteps],
  );

  const genderOptions = useMemo(
    () => [
      { value: "no-preference", label: t("genderNoPref") },
      { value: "female", label: t("genderFemale") },
      { value: "male", label: t("genderMale") },
    ],
    [t],
  );

  const countries = useMemo(
    () =>
      countryOptions.map((o, i) =>
        i === 0 ? { ...o, label: t("selectCountry") } : o,
      ),
    [t],
  );

  const timezones = useMemo(
    () =>
      timezoneOptions.map((o, i) =>
        i === 0 ? { ...o, label: t("selectTimezone") } : o,
      ),
    [t],
  );

  useEffect(() => {
    fetch("/api/public/courses")
      .then((r) => r.json())
      .then((json: { ok?: boolean; courses?: { slug: string; title: string }[] }) => {
        if (json.ok && json.courses?.length) {
          setCourseOptions([
            { value: "", label: t("coursePlaceholder") },
            ...json.courses.map((c) => ({ value: c.slug, label: c.title })),
          ]);
        }
      })
      .catch(() => undefined);
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      studentName: "",
      parentName: "",
      email: "",
      whatsapp: "",
      country: "",
      timezone: "",
      courseSlug: "",
      preferredTime: "",
      teacherGenderPref: "no-preference",
    },
    mode: "onTouched",
  });

  const next = async () => {
    const fields = stepFields[step];
    const ok = fields.length ? await trigger(fields) : true;
    if (ok) setStep((s) => Math.min(3, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (data: BookingInput) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Failed");
      setServerMessage(json.message ?? t("success"));
      setStatus("success");
      reset();
      setStep(1);
    } catch (err) {
      setServerMessage(
        err instanceof Error
          ? err.message
          : "Could not submit booking. Please try WhatsApp instead.",
      );
      setStatus("error");
    }
  };

  const values = getValues();
  const selectedCourse = courseOptions.find((c) => c.value === values.courseSlug);

  if (status === "success") {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          {t("jazakAllah")}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{serverMessage}</p>
        <Button
          className="mt-6"
          type="button"
          onClick={() => {
            setStatus("idle");
            setServerMessage("");
          }}
        >
          {t("bookAnother")}
        </Button>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-8 flex flex-wrap gap-2">
        {steps.map((s) => (
          <div
            key={s.id}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              step === s.id
                ? "bg-royal/20 text-sky"
                : step > s.id
                  ? "bg-cyan/10 text-cyan"
                  : "bg-white/5 text-muted",
            )}
          >
            {s.id}. {s.title}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {step === 1 ? (
              <>
                <Input
                  label={t("studentName")}
                  autoComplete="name"
                  placeholder={t("studentNamePlaceholder")}
                  error={errors.studentName?.message}
                  {...register("studentName")}
                />
                <Input
                  label={t("parentName")}
                  autoComplete="name"
                  placeholder={t("parentNamePlaceholder")}
                  error={errors.parentName?.message}
                  {...register("parentName")}
                />
                <Input
                  label={t("email")}
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      label={t("whatsapp")}
                      required
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      error={errors.whatsapp?.message}
                      placeholder={t("whatsappPlaceholder")}
                    />
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Select
                  label={t("country")}
                  options={countries}
                  error={errors.country?.message}
                  {...register("country")}
                />
                <Select
                  label={t("timezone")}
                  options={timezones}
                  error={errors.timezone?.message}
                  {...register("timezone")}
                />
                <Select
                  label={t("course")}
                  options={courseOptions}
                  error={errors.courseSlug?.message}
                  {...register("courseSlug")}
                />
                <Input
                  label={t("preferredTime")}
                  placeholder={t("preferredTimePlaceholder")}
                  error={errors.preferredTime?.message}
                  {...register("preferredTime")}
                />
                <Select
                  label={t("teacherGender")}
                  options={genderOptions}
                  error={errors.teacherGenderPref?.message}
                  {...register("teacherGenderPref")}
                />
              </>
            ) : null}

            {step === 3 ? (
              <div className="space-y-3 text-sm text-muted">
                <p className="font-display text-lg font-semibold text-foreground">
                  {t("reviewTitle", { trialOffer: tSite("trialOffer") })}
                </p>
                <dl className="space-y-2 rounded-2xl border border-border bg-surface/30 p-4">
                  <div className="flex justify-between gap-4">
                    <dt>{t("student")}</dt>
                    <dd className="text-foreground">{values.studentName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("parent")}</dt>
                    <dd className="text-foreground">{values.parentName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("email")}</dt>
                    <dd className="text-foreground">{values.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("whatsapp")}</dt>
                    <dd className="text-foreground">{values.whatsapp}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("course")}</dt>
                    <dd className="text-foreground">
                      {selectedCourse?.label ?? values.courseSlug}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("schedule")}</dt>
                    <dd className="text-right text-foreground">
                      {values.preferredTime}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t("location")}</dt>
                    <dd className="text-right text-foreground">
                      {values.country} · {values.timezone}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {status === "error" ? (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {serverMessage}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={back}
            disabled={step === 1 || isSubmitting}
          >
            {t("back")}
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={next}>
              {t("continue")}
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("confirm")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
