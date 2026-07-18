"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { dashboardPathForRole } from "@/lib/roles";

export function AuthNav({ onNavigate }: { onNavigate?: () => void }) {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <span className="hidden h-9 w-16 sm:inline-block" aria-hidden />
    );
  }

  if (data?.user) {
    return (
      <Link
        href={dashboardPathForRole(data.user.role)}
        onClick={onNavigate}
        className="focus-ring hidden rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-sky/40 hover:text-foreground sm:inline-flex"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className="focus-ring hidden rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-sky/40 hover:text-foreground sm:inline-flex"
    >
      Sign in
    </Link>
  );
}
