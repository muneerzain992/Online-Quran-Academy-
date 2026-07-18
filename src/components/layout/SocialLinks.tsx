"use client";

import { useTranslations } from "next-intl";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl, site } from "@/config/site";
import { cn } from "@/lib/cn";

type SocialLinksProps = {
  className?: string;
  /** icon = logo buttons only; stacked = icon + label rows */
  variant?: "icons" | "stacked";
};

export function SocialLinks({
  className,
  variant = "icons",
}: SocialLinksProps) {
  const t = useTranslations("Footer");

  const items = [
    {
      key: "facebook" as const,
      href: site.facebookUrl,
      label: t("facebook"),
      Icon: FacebookIcon,
    },
    {
      key: "instagram" as const,
      href: site.instagramUrl,
      label: t("instagram"),
      Icon: InstagramIcon,
    },
    {
      key: "tiktok" as const,
      href: site.tiktokUrl,
      label: t("tiktok"),
      Icon: TikTokIcon,
    },
    {
      key: "whatsapp" as const,
      href: getWhatsAppUrl(),
      label: t("whatsapp"),
      Icon: WhatsAppIcon,
    },
  ];

  if (variant === "stacked") {
    return (
      <ul className={cn("space-y-3 text-sm", className)}>
        {items.map(({ key, href, label, Icon }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 text-muted transition-colors hover:text-sky"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="list"
      aria-label={t("socials")}
    >
      {items.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          role="listitem"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/5 text-muted transition hover:border-sky/40 hover:bg-royal/10 hover:text-sky"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
