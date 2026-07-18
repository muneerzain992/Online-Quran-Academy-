import { getTranslations } from "next-intl/server";
import {
  Award,
  Clock,
  HeartHandshake,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardTitle,
  SectionHeading,
} from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const icons = [Award, Clock, UserRound, HeartHandshake, Users, ShieldCheck];

export async function WhyChoose() {
  const t = await getTranslations("Home.whyChoose");
  const features = t.raw("features") as { title: string; description: string }[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          description={t("intro")}
          align="center"
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = icons[i % icons.length];
          return (
            <StaggerItem key={feature.title}>
              <Card hover className="h-full">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-royal/15 text-sky">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
