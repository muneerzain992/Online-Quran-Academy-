"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Clock, Users, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  SectionHeading,
} from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import type { HomeCourse } from "@/content/home";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Locale } from "@/i18n/config";

function useLocalizedCourse(course: HomeCourse): HomeCourse {
  const locale = useLocale() as Locale;
  const t = useTranslations("CourseTitles");
  if (locale === "en") return course;
  try {
    return {
      ...course,
      title: t(`${course.slug}.title`),
      description: t(`${course.slug}.description`),
      audience: t(`${course.slug}.audience`),
      duration: t(`${course.slug}.duration`),
    };
  } catch {
    return course;
  }
}

export function Courses({ items }: { items: HomeCourse[] }) {
  const t = useTranslations("Home.courses");
  const [selected, setSelected] = useState<HomeCourse | null>(null);

  return (
    <section
      id="courses"
      className="border-y border-border/60 bg-midnight/20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("heading")}
            description={t("intro")}
            align="center"
          />
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              onSelect={setSelected}
            />
          ))}
        </Stagger>

        <Reveal className="mt-10 flex justify-center">
          <Button href="/courses" variant="secondary">
            {t("cta")}
          </Button>
        </Reveal>
      </div>

      <CourseModal course={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function CourseCard({
  course,
  onSelect,
}: {
  course: HomeCourse;
  onSelect: (c: HomeCourse) => void;
}) {
  const localized = useLocalizedCourse(course);
  return (
    <StaggerItem>
      <button
        type="button"
        onClick={() => onSelect(localized)}
        className="focus-ring h-full w-full text-start"
      >
        <Card hover className="h-full transition-colors hover:border-sky/35">
          <CardTitle className="text-base">{localized.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {localized.description}
          </CardDescription>
          <div className="mt-4 space-y-1.5 text-xs text-muted">
            <p className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sky" aria-hidden />
              {localized.audience}
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
              {localized.duration}
            </p>
          </div>
        </Card>
      </button>
    </StaggerItem>
  );
}

function CourseModal({
  course,
  onClose,
}: {
  course: HomeCourse | null;
  onClose: () => void;
}) {
  const t = useTranslations("Courses");
  const tCta = useTranslations("Cta");
  const titleId = useId();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!course) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [course, onClose]);

  return (
    <AnimatePresence>
      {course ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Close course details"
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="focus-ring absolute end-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-royal/15 text-sky">
              <BookOpen className="h-5 w-5" aria-hidden />
            </div>
            <h3
              id={titleId}
              className="pe-8 font-display text-2xl font-semibold text-foreground"
            >
              {course.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {course.description}
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-muted">{t("audience")}</dt>
                <dd className="mt-1 text-foreground">{course.audience}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("duration")}</dt>
                <dd className="mt-1 text-foreground">{course.duration}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/book">{tCta("bookTrial")}</Button>
              <Button href={`/courses/${course.slug}`} variant="secondary">
                {t("allCourses")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
