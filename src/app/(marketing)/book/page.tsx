import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { BookingForm } from "@/components/forms/BookingForm";
import { Reveal } from "@/components/motion";
import { getWhatsAppUrl, site } from "@/config/site";
import { Button } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Book");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function BookPage() {
  const t = await getTranslations("Book");
  const howSteps = t.raw("howItWorks.steps") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      >
        <p className="mt-4 text-sm text-muted">
          {t("preferChat")}{" "}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky hover:underline"
          >
            {t("whatsappLink")}
          </a>
        </p>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
        <Reveal>
          <BookingForm />
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {t("howItWorks.title")}
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-muted">
                {howSteps.map((step, i) => (
                  <li key={i}>
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
              <Button href="/courses" variant="secondary" className="mt-6 w-full">
                {t("browseCourses")}
              </Button>
            </div>
            <div className="rounded-3xl border border-gold/30 bg-gold/10 p-5 text-sm text-foreground/90">
              <p className="font-semibold text-gold">{t("affordableTitle")}</p>
              <p className="mt-2 text-muted">
                {t("affordableBody", { price: site.startingPrice })}
              </p>
            </div>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
