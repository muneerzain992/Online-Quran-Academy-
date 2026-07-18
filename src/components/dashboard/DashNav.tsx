"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type DashNavItem = { href: string; label: string };

export function DashNav({ nav }: { nav: DashNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex flex-row gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {nav.map((item) => {
        const root =
          item.href === "/dashboard" ||
          item.href === "/teacher" ||
          item.href === "/admin";
        const active = root
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-ring whitespace-nowrap rounded-xl px-3 py-2 text-sm",
              active
                ? "bg-royal/20 text-sky"
                : "text-muted hover:bg-white/5 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
