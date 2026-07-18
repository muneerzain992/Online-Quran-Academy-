import Link from "next/link";
import { Logo } from "@/components/layout";
import { SignOutButton } from "./SignOutButton";
import { DashNav, type DashNavItem } from "./DashNav";

export type { DashNavItem };

type DashShellProps = {
  title: string;
  subtitle?: string;
  nav: DashNavItem[];
  children: React.ReactNode;
};

export function DashShell({ title, subtitle, nav, children }: DashShellProps) {
  return (
    <div className="min-h-full bg-hero-glow">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
          <div className="min-w-0">
            <Logo />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="text-sm text-muted hover:text-sky">
              Website
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-[220px_1fr]">
        <aside className="min-w-0 space-y-4 sm:space-y-6">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 break-words text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
          <DashNav nav={nav} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
