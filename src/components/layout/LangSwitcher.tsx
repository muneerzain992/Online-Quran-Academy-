"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { site } from "@/config/site";
import { type Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/cn";

export function LangSwitcher() {
  const locale = useLocale();
  const t = useTranslations("A11y");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onSelect = (code: Locale) => {
    if (code === locale) return;
    startTransition(async () => {
      await setUserLocale(code);
      router.refresh();
    });
  };

  return (
    <div
      className="hidden items-center gap-1 sm:flex"
      role="group"
      aria-label={t("language")}
    >
      {site.locales.map((item) => {
        const active = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            disabled={pending}
            onClick={() => onSelect(item.code)}
            aria-pressed={active}
            className={cn(
              "focus-ring rounded-md px-2 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-royal/20 text-sky"
                : "text-muted hover:bg-white/5 hover:text-foreground",
              pending && "opacity-60",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
