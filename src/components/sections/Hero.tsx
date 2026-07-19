import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui";
import { site } from "@/config/site";
import { HeroVisual } from "./HeroVisual";

export async function Hero() {
  const t = await getTranslations("Home.hero");
  const tCta = await getTranslations("Cta");

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgb(30_90_255_/_0.18),transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-12 lg:py-28">
        <div className="relative z-10 min-w-0">
          <p className="mb-5 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-sky shadow-sm">
            {t("eyebrow")}
          </p>

          <h1 className="font-display text-[1.875rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl sm:leading-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            {t("headline")}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {t("subheading")}
          </p>

          <p className="mt-5 text-sm font-medium text-foreground/90 sm:text-base">
            {t("priceLine", { price: site.startingPrice })}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href="/book" className="w-full sm:w-auto">
              {tCta("bookTrial")}
            </Button>
            <Button
              href="/courses"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {tCta("exploreCourses")}
            </Button>
          </div>
        </div>

        <div className="relative lg:justify-self-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
