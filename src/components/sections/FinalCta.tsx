import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui";

export async function FinalCta() {
  const t = await getTranslations("Home.finalCta");

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-sky/20 bg-gradient-to-br from-royal/30 via-midnight to-navy px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(56_189_248_/_0.2),transparent_55%)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {t("body")}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/book">{t("cta")}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
