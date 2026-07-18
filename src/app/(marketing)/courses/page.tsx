import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Clock, Users } from "lucide-react";
import { PageHero } from "@/components/layout";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { Pricing } from "@/components/sections";
import { Stagger, StaggerItem } from "@/components/motion";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getPlans, getPublishedCourses } from "@/lib/cms";
import { localizeCourse } from "@/lib/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Courses");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function CoursesPage() {
  const t = await getTranslations("Courses");
  const tCta = await getTranslations("Cta");
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const [courses, plans] = await Promise.all([
    getPublishedCourses(),
    getPlans(),
  ]);

  const localizedCourses = courses.map((course) =>
    localizeCourse(course, messages, locale),
  );

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("pageDescription")}
      >
        <div className="mt-6">
          <Button href="/book">{tCta("bookTrial")}</Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {localizedCourses.map((course) => (
            <StaggerItem key={course.slug}>
              <Link href={`/courses/${course.slug}`} className="focus-ring block h-full">
                <Card hover className="h-full">
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                  <div className="mt-4 space-y-1.5 text-xs text-muted">
                    <p className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-sky" aria-hidden />
                      {course.audience}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold" aria-hidden />
                      {course.duration}
                    </p>
                  </div>
                  <span className="mt-4 inline-block text-sm font-medium text-sky">
                    {t("viewDetails")}
                  </span>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Pricing plans={plans} />
    </>
  );
}
