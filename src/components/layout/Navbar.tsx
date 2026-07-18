"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { site } from "@/config/site";
import { SearchDialog } from "@/components/search/SearchDialog";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitcher } from "./LangSwitcher";
import { AuthNav } from "./AuthNav";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const tNav = useTranslations("Nav");
  const tCta = useTranslations("Cta");

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
        <div onClick={() => setOpen(false)}>
          <Logo priority />
        </div>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={tNav("primary")}
        >
          {site.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-royal/15 font-medium text-sky"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {tNav(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchDialog />
          <LangSwitcher />
          <ThemeToggle />
          <AuthNav onNavigate={() => setOpen(false)} />
          <Link
            href={site.cta.demo.href}
            className="focus-ring hidden rounded-xl bg-royal px-3 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgb(30_90_255_/_0.35)] transition hover:bg-royal/90 sm:inline-flex"
          >
            {tCta("demo")}
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="glass mx-auto mt-2 max-w-6xl rounded-2xl px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label={tNav("mobile")}>
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`focus-ring rounded-lg px-3 py-3 text-sm ${
                    active
                      ? "bg-royal/15 font-medium text-sky"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tNav(item.key)}
                </Link>
              );
            })}
            <Link
              href={site.cta.demo.href}
              onClick={() => setOpen(false)}
              className="focus-ring mt-2 rounded-xl bg-royal px-3 py-3 text-center text-sm font-medium text-white"
            >
              {tCta("demo")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
