import { getTranslations } from "next-intl/server";
import { Counter, Reveal } from "@/components/motion";
import { homeStats } from "@/content/home";

export async function Stats() {
  const t = await getTranslations("Home.stats");
  const labels = [t("students"), t("teachers"), t("countries"), t("years")];

  return (
    <section className="border-y border-border/60 bg-section-band py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-6">
            {homeStats.map((stat, i) => (
              <Counter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={labels[i] ?? stat.label}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
