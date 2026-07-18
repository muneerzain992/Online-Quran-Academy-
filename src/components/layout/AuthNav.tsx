"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { dashboardPathForRole } from "@/lib/roles";
import { cn } from "@/lib/cn";

export function AuthNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <span
        className={cn("hidden h-9 w-16 lg:inline-block", className)}
        aria-hidden
      />
    );
  }

  if (data?.user) {
    return (
      <Link
        href={dashboardPathForRole(data.user.role)}
        onClick={onNavigate}
        className={cn(
          "focus-ring hidden rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-sky/40 hover:text-foreground lg:inline-flex",
          className,
        )}
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className={cn(
        "focus-ring hidden rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-sky/40 hover:text-foreground lg:inline-flex",
        className,
      )}
    >
      Sign in
    </Link>
  );
}
