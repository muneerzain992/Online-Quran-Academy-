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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted hover:text-sky">
              Website
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
          <DashNav nav={nav} />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
