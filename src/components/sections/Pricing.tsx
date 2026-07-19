"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { cn } from "@/lib/cn";

export type PricingPlanItem = {
  id: string;
  name: string;
  price: string;
  period: string;
  classesPerWeek: string;
  duration: string;
  classesPerWeekNum: number;
  minutesPerClass: number;
  popular: boolean;
};

function classesLabel(count: number, t: ReturnType<typeof useTranslations>) {
  if (count === 3) return t("classesWeek3");
  if (count === 5) return t("classesWeek5");
  if (count === 6) return t("classesWeek6");
  return `${count} classes per week`;
}

function minutesLabel(count: number, t: ReturnType<typeof useTranslations>) {
  if (count === 30) return t("minutes30");
  if (count === 45) return t("minutes45");
  return `${count} minutes per class`;
}

export function Pricing({ plans }: { plans: PricingPlanItem[] }) {
  const t = useTranslations("Home.pricing");
  const tPlans = useTranslations("Plans");

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          align="center"
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <StaggerItem key={plan.id}>
            <PricingCard
              plan={plan}
              displayName={
                plan.name === "Basic" ||
                plan.name === "Standard" ||
                plan.name === "Premium"
                  ? tPlans(plan.name)
                  : plan.name
              }
              ctaLabel={t("ctaLabel")}
              popularLabel={t("popular")}
              periodLabel={t("perMonth")}
              classesText={classesLabel(plan.classesPerWeekNum, t)}
              durationText={minutesLabel(plan.minutesPerClass, t)}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function PricingCard({
  plan,
  displayName,
  ctaLabel,
  popularLabel,
  periodLabel,
  classesText,
  durationText,
}: {
  plan: PricingPlanItem;
  displayName: string;
  ctaLabel: string;
  popularLabel: string;
  periodLabel: string;
  classesText: string;
  durationText: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full rounded-3xl border p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-0.5",
        plan.popular
          ? "border-gold/40 bg-gradient-to-b from-gold/10 via-surface/40 to-surface/20 shadow-[0_0_40px_rgb(232_185_35_/_0.12)]"
          : "glass",
      )}
    >
      {plan.popular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/50 bg-navy px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold">
          {popularLabel}
        </span>
      ) : null}

      <h3 className="font-display text-xl font-semibold text-foreground">
        {displayName}
      </h3>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold text-foreground">
          {plan.price}
        </span>
        <span className="text-sm text-muted">{periodLabel}</span>
      </p>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        <li>{classesText}</li>
        <li>{durationText}</li>
      </ul>
      <CheckoutButton
        planName={plan.name as "Basic" | "Standard" | "Premium"}
        popular={plan.popular}
        label={ctaLabel}
      />
    </div>
  );
}
