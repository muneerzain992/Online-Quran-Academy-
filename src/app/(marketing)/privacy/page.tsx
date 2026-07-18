import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal");
  return { title: t("privacyTitle"), description: t("privacyDesc") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Legal");
  const stored = t.raw("whatWeStore") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("privacyTitle")}
        description={t("privacyDesc")}
      />
      <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p>{t("privacyIntro")}</p>
        <h2>{t("whatWeStoreTitle")}</h2>
        <ul>
          {stored.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>{t("howWeUseTitle")}</h2>
        <p>{t("howWeUse")}</p>
        <h2>{t("contactTitle")}</h2>
        <p>
          {t("contactBody", { email: site.email, phone: site.phone })}
        </p>
        <p className="text-sm text-muted">{t("lastUpdated")}</p>
      </article>
    </>
  );
}
