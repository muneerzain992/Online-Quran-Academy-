import { getTranslations } from "next-intl/server";
import { MonitorPlay, UserRound, Video } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const icons = [Video, MonitorPlay, UserRound];

export async function HowWeConduct() {
  const t = await getTranslations("Home.howWeConduct");
  const items = t.raw("items") as string[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t("heading")}
        </h2>
      </Reveal>

      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <StaggerItem key={item}>
              <div className="glass flex flex-col items-center gap-3 rounded-2xl px-5 py-8 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-royal/15 text-sky">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                  {item}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
