import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero, SocialLinks } from "@/components/layout";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getMailtoUrl, getTelUrl, site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heading")}
        description={t("description")}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {t("sendMessage")}
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Card className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {t("reachUs")}
              </h2>
              <a
                href={getTelUrl()}
                className="focus-ring flex items-center gap-3 text-sm text-muted hover:text-sky"
              >
                <Phone className="h-4 w-4 text-sky" aria-hidden />
                {site.phone}
              </a>
              <a
                href={getMailtoUrl()}
                className="focus-ring flex items-center gap-3 break-all text-sm text-muted hover:text-sky"
              >
                <Mail className="h-4 w-4 text-sky" aria-hidden />
                {site.email}
              </a>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
                  {t("socialMedia")}
                </p>
                <SocialLinks />
              </div>

              <p className="flex items-start gap-3 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                {site.serving}
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-border">
              <iframe
                title={t("mapNote")}
                src="https://maps.google.com/maps?q=London%20UK&t=&z=3&ie=UTF8&iwloc=&output=embed"
                className="h-64 w-full grayscale-[30%] contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-xs text-muted">{t("mapNote")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
