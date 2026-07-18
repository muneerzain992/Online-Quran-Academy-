import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return { title: t("signIn") };
}

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("signIn")}
        description={t("signInPageDesc")}
      />
      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <Suspense fallback={<p className="text-sm text-muted">{t("loading")}</p>}>
            <LoginForm />
          </Suspense>
        </Card>
      </section>
    </>
  );
}
