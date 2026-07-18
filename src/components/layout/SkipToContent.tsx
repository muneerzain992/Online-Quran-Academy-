"use client";

import { useTranslations } from "next-intl";

export function SkipToContent() {
  const t = useTranslations("A11y");

  return (
    <a
      href="#main-content"
      className="focus-ring sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-royal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      {t("skipToContent")}
    </a>
  );
}
