import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Newsletter subscribers
      </h2>
      <ul className="mt-4 space-y-2">
        {subscribers.length === 0 ? (
          <li className="text-sm text-muted">No subscribers yet.</li>
        ) : (
          subscribers.map((s) => (
            <li
              key={s.id}
              className="flex justify-between border-b border-border/60 py-2 text-sm"
            >
              <span className="text-foreground">{s.email}</span>
              <span className="text-muted">
                {s.locale} · {s.createdAt.toLocaleDateString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
