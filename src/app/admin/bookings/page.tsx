import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: true },
    take: 50,
  });

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-foreground">
        All bookings
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="pb-3 pr-3">Student</th>
              <th className="pb-3 pr-3">Course</th>
              <th className="pb-3 pr-3">Contact</th>
              <th className="pb-3 pr-3">When</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border/60">
                <td className="py-3 pr-3 text-foreground">{b.studentName}</td>
                <td className="py-3 pr-3 text-muted">
                  {b.course?.title ?? "—"}
                </td>
                <td className="py-3 pr-3 text-muted">
                  {b.email}
                  <br />
                  {b.whatsapp}
                </td>
                <td className="py-3 pr-3 text-muted">{b.preferredTime}</td>
                <td className="py-3 text-sky">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
