import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout";
import { Button } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import {
  countryKeywords,
  familyKeywords,
  longTailKeywords,
  primaryKeywords,
  transactionalKeywords,
} from "@/config/seo-keywords";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Learn Quran Online | Online Quran Classes Worldwide",
  description:
    "Learn Quran online with certified teachers. Book live one-to-one online Quran classes for kids and adults — Tajweed, Hifz, Noorani Qaida, and Islamic studies. Free trial for USA, UK, Canada, Australia, Gulf, and worldwide families.",
  keywords: [
    ...primaryKeywords,
    ...transactionalKeywords,
    ...longTailKeywords,
    ...countryKeywords.slice(0, 12),
  ],
  alternates: {
    canonical: "/learn-quran-online",
  },
  openGraph: {
    title: "Learn Quran Online | Dr Farhat Hashmi Online Quran Academy",
    description:
      "Live online Quran classes with male and female teachers. Free trial for overseas families.",
    url: "/learn-quran-online",
  },
};

const pathways = [
  {
    title: "Quran Classes for Kids & Beginners",
    body: "Start with Noorani Qaida, Arabic alphabet, and basic Quran reading — ideal for children and adults learning from scratch.",
    href: "/courses/norani-qaida",
  },
  {
    title: "Online Tajweed & Recitation Classes",
    body: "Improve Quran pronunciation with live Tajweed teachers who correct every letter in real time.",
    href: "/courses/tajweed",
  },
  {
    title: "Hifz Quran Online",
    body: "Structured memorization with daily revision support — Hifz for kids and adults worldwide.",
    href: "/courses/hifz-ul-quran",
  },
  {
    title: "Islamic Studies Online",
    body: "Daily duas, Salah, translation, and basic tafseer for a well-rounded Islamic education.",
    href: "/courses/islamic-duas-salah",
  },
];

export default function LearnQuranOnlinePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Learn Quran Online", path: "/learn-quran-online" },
        ])}
      />

      <PageHero
        eyebrow="Online Quran Academy"
        title="Learn Quran Online with Certified Teachers"
        description="Live one-to-one online Quran classes for kids, adults, and families — Tajweed, Hifz, Noorani Qaida, and Islamic studies from home, worldwide."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/book">Book Free Quran Trial Class</Button>
          <Button href="/courses" variant="secondary">
            Explore Online Quran Courses
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Why choose our online Quran academy?
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Families searching for the best online Quran academy want flexible
            timings, trusted teachers, and clear progress. We offer personalized
            Quran learning with male and female teachers and a free trial before
            you enrol.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
          {pathways.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href}
                className="focus-ring glass block rounded-2xl p-6 transition hover:border-sky/35"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-border/60 bg-section-band py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Online Quran classes worldwide
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              We teach students across {site.regions.slice(0, 8).join(", ")}, and
              more. Whether you need Quran classes for children, adults,
              beginners, sisters, boys, or girls — book a live class that fits
              your time zone.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-2 text-sm text-muted sm:grid-cols-2 lg:grid-cols-3">
            {[...countryKeywords.slice(0, 12), ...familyKeywords.slice(0, 6)].map(
              (keyword) => (
                <li key={keyword} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                  {keyword}
                </li>
              ),
            )}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/book">Start Free Trial</Button>
            <Button href="/teachers" variant="secondary">
              Meet Online Quran Teachers
            </Button>
            <Button href="/blog" variant="secondary">
              Quran Learning Blog
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
