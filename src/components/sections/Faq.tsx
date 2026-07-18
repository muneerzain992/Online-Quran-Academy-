import { getTranslations } from "next-intl/server";
import { Accordion, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";

type FaqItem = { id: string; question: string; answer: string };

export async function Faq({ items }: { items?: FaqItem[] }) {
  const t = await getTranslations("Home.faq");
  const keys = [
    "free-trial",
    "cost",
    "female-teachers",
    "platform",
    "timings",
    "beginners",
    "one-to-one",
    "get-started",
  ] as const;

  const translated = keys.map((id) => ({
    id,
    question: t(`items.${id}.q`),
    answer: t(`items.${id}.a`),
  }));

  const list = translated.length ? translated : items ?? [];

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          description={t("description")}
          align="center"
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <Accordion items={list} />
      </Reveal>
    </section>
  );
}
