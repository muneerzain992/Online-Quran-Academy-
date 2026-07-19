import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Star } from "lucide-react";
import { PageHero } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { site } from "@/config/site";
import { getActiveTeachers, getTeacherBySlug } from "@/lib/cms";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const rows = await prisma.teacher.findMany({
      where: { active: true },
      select: { slug: true },
    });
    if (rows.length) return rows.map((r) => ({ slug: r.slug }));
  } catch {
    /* build without DB */
  }
  const teachers = await getActiveTeachers();
  return teachers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);
  if (!teacher) return { title: "Teacher" };
  return {
    title: teacher.name,
    description: teacher.bio,
  };
}

export default async function TeacherDetailPage({ params }: Props) {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);
  if (!teacher) notFound();

  const others = (await getActiveTeachers())
    .filter((t) => t.slug !== teacher.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={teacher.gender === "female" ? "Female Teacher" : "Male Teacher"}
        title={teacher.name}
        description={teacher.title}
      >
        <div className="mt-4 flex items-center gap-1 text-gold">
          {Array.from({ length: Math.round(teacher.rating) }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-gold" aria-hidden />
          ))}
          <span className="ml-2 text-sm text-muted">
            {teacher.experienceYears}+ years experience
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/book">Book a class with us</Button>
          <Button href="/teachers" variant="secondary">
            All teachers
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Reveal>
          <div className="space-y-8">
            <p className="text-base leading-relaxed text-muted">{teacher.bio}</p>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Certifications
              </h2>
              <ul className="mt-4 space-y-2">
                {teacher.certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-cyan" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Subjects
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full border border-sky/30 bg-royal/10 px-3 py-1 text-xs text-sky"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="space-y-4">
            <p className="font-display text-lg font-semibold text-foreground">
              Prefer this teaching style?
            </p>
            <p className="text-sm text-muted">
              Request {site.trialOffer} and share your teacher gender preference
              when you book.
            </p>
            <Button href="/book" className="w-full">
              Book Free Trial Class
            </Button>
          </Card>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-section-band py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            More teachers
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/teachers/${item.slug}`}
                className="focus-ring glass rounded-2xl p-5 hover:border-sky/35"
              >
                <p className="font-display font-semibold text-foreground">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-sky">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
