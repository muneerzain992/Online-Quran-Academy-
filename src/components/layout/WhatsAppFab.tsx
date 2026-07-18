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
      className="focus-ring fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] start-[max(1.25rem,env(safe-area-inset-left))] z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgb(37_211_102_/_0.45)] transition hover:scale-105 hover:bg-[#1ebe57] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:start-[max(1.5rem,env(safe-area-inset-left))] sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
