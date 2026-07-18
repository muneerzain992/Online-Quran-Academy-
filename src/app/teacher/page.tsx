import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Teacher dashboard" };

export default async function TeacherDashboardPage() {
  const [newBookings, students, notes] = await Promise.all([
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.progressNote.count(),
  ]);

  const recent = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { course: true },
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="New trial requests" value={newBookings} />
        <StatCard label="Students" value={students} />
        <StatCard label="Progress notes" value={notes} />
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Upcoming / recent requests
        </h2>
        <ul className="mt-4 space-y-3">
          {recent.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap justify-between gap-2 border-b border-border/60 pb-3 text-sm"
            >
              <span className="text-foreground">
                {b.studentName} — {b.course?.title ?? "Trial"}
              </span>
              <span className="text-muted">
                {b.preferredTime} · {b.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
