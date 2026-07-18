import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui";
import { MagneticButton, Reveal, TextReveal } from "@/components/motion";
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
          <Reveal>
            <p className="mb-5 inline-flex rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-sky">
              {t("eyebrow")}
            </p>
          </Reveal>

          <TextReveal
            as="h1"
            text={t("headline")}
            className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
            delay={0.05}
          />

          <Reveal delay={0.15} className="mt-6">
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {t("subheading")}
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-5">
            <p className="text-sm font-medium text-foreground/90 sm:text-base">
              {t("priceLine", { price: site.startingPrice })}
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href="/book">{tCta("bookTrial")}</MagneticButton>
            <Button href="/courses" variant="secondary">
              {tCta("exploreCourses")}
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative lg:justify-self-end">
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}
