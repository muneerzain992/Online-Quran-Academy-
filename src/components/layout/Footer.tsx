"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getMailtoUrl, getTelUrl, site } from "@/config/site";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations("Footer");
  const tSite = useTranslations("Site");

  return (
    <footer className="relative mt-auto border-t border-border bg-midnight/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Logo showText={false} size="md" />
          <p className="font-display text-sm font-semibold leading-snug text-foreground">
            {site.name}
          </p>
          <p className="text-sm italic text-muted">{tSite("tagline")}</p>
          <p className="text-xs leading-relaxed text-muted">{tSite("serving")}</p>
          <SocialLinks />
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
            {t("quickLinks")}
          </h2>
          <ul className="space-y-2">
            {site.footerQuickLinks.map((link) => (
              <li key={link.href + link.key}>
                <Link
                  href={link.href}
                  className="focus-ring text-sm text-muted transition-colors hover:text-sky"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
            {t("ourCourses")}
          </h2>
          <ul className="space-y-2">
            {site.footerCourses.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="focus-ring text-sm text-muted transition-colors hover:text-sky"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-sm font-semibold text-foreground">
            {t("contactUs")}
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={getTelUrl()}
                className="focus-ring inline-flex items-center gap-2 text-muted transition-colors hover:text-sky"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={getMailtoUrl()}
                className="focus-ring inline-flex items-center gap-2 break-all text-muted transition-colors hover:text-sky"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {site.email}
              </a>
            </li>
          </ul>

          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            © {year} {site.name}. {t("rights")}
          </p>
          <div className="flex gap-4">
            {site.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring hover:text-sky"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
