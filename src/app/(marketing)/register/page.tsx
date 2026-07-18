import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return { title: t("createAccount") };
}

export default async function RegisterPage() {
  const t = await getTranslations("Auth");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("createAccount")}
        description={t("registerPageDesc")}
      />
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <RegisterForm />
        </Card>
      </section>
    </>
  );
}
