import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [bookings, messages, subscribers, users, courses, pageViews] =
    await Promise.all([
      prisma.booking.count(),
      prisma.contactMessage.count(),
      prisma.subscriber.count(),
      prisma.user.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.pageView.count(),
    ]);

  const latestBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { course: true },
  });

  const topPaths = await prisma.pageView.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Bookings" value={bookings} />
        <StatCard label="Messages" value={messages} />
        <StatCard label="Subscribers" value={subscribers} />
        <StatCard label="Users" value={users} />
        <StatCard label="Courses" value={courses} />
        <StatCard label="Page views" value={pageViews} />
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Latest trial bookings
        </h2>
        <ul className="mt-4 space-y-3">
          {latestBookings.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap justify-between gap-2 border-b border-border/60 pb-3 text-sm"
            >
              <span className="text-foreground">
                {b.studentName} · {b.course?.title ?? "Trial"}
              </span>
              <span className="text-muted">{b.status}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Edit site content under Courses, Teachers, Plans, FAQs, Blog, and Testimonials.
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Top pages
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {topPaths.map((row) => (
            <li
              key={row.path}
              className="flex justify-between gap-3 border-b border-border/60 pb-2"
            >
              <span className="truncate text-foreground">{row.path}</span>
              <span className="shrink-0 text-muted">{row._count.path}</span>
            </li>
          ))}
          {!topPaths.length ? (
            <li className="text-muted">No page views recorded yet.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
