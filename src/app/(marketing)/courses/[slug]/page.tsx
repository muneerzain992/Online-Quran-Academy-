import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Check, Clock, GraduationCap, Users } from "lucide-react";
import { PageHero } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getCourseBySlug, getPublishedCourses } from "@/lib/cms";
import { localizeCourse } from "@/lib/localize";
import { prisma } from "@/lib/prisma";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const rows = await prisma.course.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (rows.length) return rows.map((r) => ({ slug: r.slug }));
  } catch {
    /* build-time without DB */
  }
  const courses = await getPublishedCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course" };
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const localized = localizeCourse(course, messages, locale);
  return {
    title: localized.title,
    description: localized.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const raw = await getCourseBySlug(slug);
  if (!raw) notFound();

  const t = await getTranslations("Courses");
  const tCta = await getTranslations("Cta");
  const tSite = await getTranslations("Site");
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const course = localizeCourse(raw, messages, locale);

  const all = await getPublishedCourses();
  const related = all
    .filter((c) => c.slug !== course.slug)
    .slice(0, 3)
    .map((c) => localizeCourse(c, messages, locale));
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(course.longDesc);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          title: course.title,
          description: course.description,
          slug: course.slug,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: t("allCourses"), path: "/courses" },
          { name: course.title, path: `/courses/${course.slug}` },
        ])}
      />
      <PageHero
        eyebrow={t("eyebrow")}
        title={course.title}
        description={course.description}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/book">{tCta("bookTrial")}</Button>
          <Button href="/courses" variant="secondary">
            {t("allCourses")}
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Reveal>
          <div className="space-y-6">
            {isHtml ? (
              <div
                className="prose prose-invert max-w-none text-muted"
                dangerouslySetInnerHTML={{ __html: course.longDesc }}
              />
            ) : (
              <p className="text-base leading-relaxed text-muted">
                {course.longDesc}
              </p>
            )}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {t("whatYouGain")}
              </h2>
              <ul className="mt-4 space-y-3">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="sticky top-28 space-y-4">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Users className="h-4 w-4 text-sky" aria-hidden />
              {course.audience}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4 text-gold" aria-hidden />
              {course.duration}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <GraduationCap className="h-4 w-4 text-cyan" aria-hidden />
              {course.level}
            </p>
            <p className="text-sm text-muted">
              {t("startingFrom")} {site.startingPrice} · {tSite("trialOffer")}
            </p>
            <Button href="/book" className="w-full">
              {tCta("bookTrial")}
            </Button>
          </Card>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-midnight/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {t("related")}
          </h2>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.slug}>
                <Link
                  href={`/courses/${item.slug}`}
                  className="focus-ring glass block rounded-2xl p-5 transition hover:border-sky/35"
                >
                  <p className="font-display font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {item.description}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
