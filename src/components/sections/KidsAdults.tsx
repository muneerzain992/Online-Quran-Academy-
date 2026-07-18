"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import {
  MagneticButton,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function KidsAdults() {
  const t = useTranslations("Home.kidsAdults");
  const tCta = useTranslations("Cta");
  const reduced = usePrefersReducedMotion();
  const learn = t.raw("learn") as string[];
  const badges = [t("badgeTrial"), t("badgeFee")];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-midnight/25">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("heading")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {t("body")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            {badges.map((badge, i) => (
              <motion.span
                key={badge}
                animate={
                  reduced
                    ? undefined
                    : { scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.35,
                }}
                className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide ${
                  i === 0
                    ? "border border-gold/40 bg-gold/15 text-gold"
                    : "border border-sky/30 bg-royal/15 text-sky"
                }`}
              >
                {badge}
              </motion.span>
            ))}
          </Reveal>

          <Reveal delay={0.18} className="mt-8">
            <MagneticButton href="/book">{t("cta")}</MagneticButton>
          </Reveal>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-sky">{tCta("exploreCourses")}</p>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {learn.map((item) => (
              <StaggerItem key={item}>
                <div className="glass flex items-start gap-3 rounded-xl px-4 py-3">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan"
                    aria-hidden
                  />
                  <span className="text-sm text-foreground/90">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-4 sm:hidden">
            <Button href="/book" className="w-full">
              {t("cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
