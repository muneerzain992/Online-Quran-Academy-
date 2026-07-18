"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/i18n/config";

type TestimonialItem = {
  quote: string;
  name: string;
  location: string;
  rating: number;
};

const NAME_TO_KEY: Record<string, "fatima" | "mohammad" | "aisha"> = {
  "Fatima Ahmed": "fatima",
  "Mohammad Hassan": "mohammad",
  "Aisha Khan": "aisha",
};

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale() as Locale;
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  const list = useMemo(() => {
    if (locale === "en") return items;
    return items.map((item) => {
      const key = NAME_TO_KEY[item.name];
      if (!key) return item;
      try {
        return {
          ...item,
          quote: t(`items.${key}.quote`),
          location: t(`items.${key}.location`),
        };
      } catch {
        return item;
      }
    });
  }, [items, locale, t]);

  const current = list[index] ?? list[0];

  useEffect(() => {
    if (reduced || list.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduced, list.length]);

  if (!current) return null;

  const prev = () =>
    setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  return (
    <section className="border-y border-border/60 bg-midnight/25 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("heading")}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="relative mt-12">
          <div
            className="glass min-h-[260px] rounded-3xl p-6 sm:p-10"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current.name}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-4 flex gap-1" aria-label="5 star rating">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-gold text-gold"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="font-display text-lg leading-relaxed text-foreground sm:text-xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <footer className="mt-6 text-sm text-muted">
                  <cite className="not-italic font-semibold text-foreground">
                    {current.name}
                  </cite>
                  <span className="mx-2 text-gold/70">·</span>
                  {current.location}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {list.map((item, i) => (
                <button
                  key={`${item.name}-${i}`}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === index ? "bg-sky" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
