import type { Metadata } from "next";
import { auth } from "@/auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Student dashboard" };

export default async function StudentDashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const [bookings, subscription, notes] = await Promise.all([
    prisma.booking.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { course: true },
    }),
    session?.user?.id
      ? prisma.subscription.findUnique({
          where: { userId: session.user.id },
          include: { plan: true },
        })
      : null,
    session?.user?.id
      ? prisma.progressNote.findMany({
          where: { studentUserId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 3,
        })
      : [],
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Plan"
          value={subscription?.plan.name ?? "None yet"}
          hint={
            subscription
              ? `Status: ${subscription.status}`
              : `Packages from ${site.startingPrice}`
          }
        />
        <StatCard label="Trial bookings" value={bookings.length} />
        <StatCard label="Progress notes" value={notes.length} />
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Recent bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No bookings yet. Start with {site.trialOffer}.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm last:border-0"
              >
                <span className="text-foreground">
                  {b.course?.title ?? "Trial class"}
                </span>
                <span className="text-muted">
                  {b.status} · {b.preferredTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Latest progress
        </h2>
        {notes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Your teacher’s notes will appear here after classes begin.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="text-sm text-muted">
                <p className="text-foreground">{n.content}</p>
                <p className="mt-1 text-xs">
                  {n.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
