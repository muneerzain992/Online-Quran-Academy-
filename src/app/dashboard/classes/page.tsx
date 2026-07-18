import type { Metadata } from "next";
import { auth } from "@/auth";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "My classes" };

export default async function StudentClassesPage() {
  const session = await auth();
  const bookings = await prisma.booking.findMany({
    where: { email: session?.user?.email ?? "" },
    orderBy: { createdAt: "desc" },
    include: { course: true },
  });

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Class requests & schedule
      </h2>
      <p className="mt-2 text-sm text-muted">
        Confirmed Zoom / Google Meet links will be shared by your teacher.
      </p>
      <ul className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <li className="text-sm text-muted">No class requests yet.</li>
        ) : (
          bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-xl border border-border bg-surface/30 p-4 text-sm"
            >
              <p className="font-medium text-foreground">
                {b.course?.title ?? "Trial"}
              </p>
              <p className="mt-1 text-muted">
                {b.preferredTime} · {b.timezone} · {b.status}
              </p>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
