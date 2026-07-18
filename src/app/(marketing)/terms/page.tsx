import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal");
  return { title: t("termsTitle"), description: t("termsDesc") };
}

export default async function TermsPage() {
  const t = await getTranslations("Legal");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("termsTitle")}
        description={t("termsDesc")}
      />
      <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p>{t("termsIntro")}</p>
        <h2>{t("classesTitle")}</h2>
        <p>{t("classesBody")}</p>
        <h2>{t("paymentsTitle")}</h2>
        <p>{t("paymentsBody")}</p>
        <h2>{t("accountsTitle")}</h2>
        <p>{t("accountsBody")}</p>
        <h2>{t("contactTitle")}</h2>
        <p>
          {t("contactBody", { email: site.email, phone: site.phone })}{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
        </p>
        <p className="text-sm text-muted">{t("lastUpdated")}</p>
      </article>
    </>
  );
}
