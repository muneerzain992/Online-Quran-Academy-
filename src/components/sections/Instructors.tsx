"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Instructors() {
  const t = useTranslations("Home.instructors");
  const reduced = usePrefersReducedMotion();
  const checklist = t.raw("checklist") as string[];
  const labels = t.raw("labels") as string[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="panel-dark relative overflow-hidden rounded-3xl border border-white/15 p-8 sm:p-10">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
            <div className="absolute -bottom-8 -start-8 h-32 w-32 rounded-full bg-royal/30 blur-2xl" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-on-dark"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p
                className="font-arabic text-3xl leading-loose text-on-dark sm:text-4xl"
                dir="rtl"
                lang="ar"
              >
                وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-3">{t("eyebrow")}</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("heading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {t("body")}
            </p>
          </Reveal>

          <Stagger className="mt-8 space-y-3">
            {checklist.map((item) => (
              <StaggerItem key={item}>
                <motion.div
                  className="flex items-start gap-3"
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/20 text-cyan">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  <span className="text-sm text-foreground/90 sm:text-base">
                    {item}
                  </span>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15} className="mt-8">
            <Button href="/teachers">{t("cta")}</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
