import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { PageHero } from "@/components/layout";
import { Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { getActiveTeachers } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Teachers");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function TeachersPage() {
  const t = await getTranslations("Teachers");
  const tCta = await getTranslations("Cta");
  const teachers = await getActiveTeachers();

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("body")}
      >
        <div className="mt-6">
          <Button href="/book">{tCta("bookTrial")}</Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <StaggerItem key={teacher.slug}>
              <Link
                href={`/teachers/${teacher.slug}`}
                className="focus-ring block h-full"
              >
                <Card hover className="h-full">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-royal to-cyan font-display text-lg font-semibold text-white">
                    {teacher.name
                      .split(" ")
                      .filter((p) => !p.startsWith("Ustad"))
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <CardTitle>{teacher.name}</CardTitle>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-sky">
                    {teacher.title}
                  </p>
                  <CardDescription className="line-clamp-3">
                    {teacher.bio}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-1 text-gold">
                    {Array.from({ length: Math.round(teacher.rating) }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold" aria-hidden />
                    ))}
                    <span className="ml-2 text-xs text-muted">
                      {t("yearsLabel", { years: teacher.experienceYears })}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {teacher.subjects.slice(0, 2).map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 inline-block text-sm font-medium text-sky">
                    {t("viewProfile")} →
                  </span>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
