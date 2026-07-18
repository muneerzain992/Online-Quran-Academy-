"use client";

import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/config/site";

export function WhatsAppFab() {
  const t = useTranslations("WhatsApp");
  const href = getWhatsAppUrl(t("prefill"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      className="focus-ring fixed bottom-6 start-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgb(37_211_102_/_0.45)] transition hover:scale-105 hover:bg-[#1ebe57]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
