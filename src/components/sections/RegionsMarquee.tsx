import { getTranslations } from "next-intl/server";
import { Marquee } from "@/components/motion";
import { site } from "@/config/site";

export async function RegionsMarquee() {
  const t = await getTranslations("Home.regions");

  return (
    <Marquee speed={38} className="bg-midnight/30">
      <span className="text-foreground/80">{t("trustedBy")}</span>
      {site.regions.map((region) => (
        <span key={region} className="mx-1 inline-flex items-center gap-3">
          <span className="text-gold/70">·</span>
          <span>{region}</span>
        </span>
      ))}
      <span className="mx-1 inline-flex items-center gap-3">
        <span className="text-gold/70">·</span>
        <span>{t("worldwide")}</span>
      </span>
    </Marquee>
  );
}
