import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Contact messages
      </h2>
      <ul className="mt-4 space-y-4">
        {messages.length === 0 ? (
          <li className="text-sm text-muted">No messages yet.</li>
        ) : (
          messages.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-border bg-surface/30 p-4 text-sm"
            >
              <p className="font-medium text-foreground">
                {m.subject} — {m.name}
              </p>
              <p className="mt-1 text-xs text-muted">
                {m.email}
                {m.phone ? ` · ${m.phone}` : ""} ·{" "}
                {m.createdAt.toLocaleString()}
              </p>
              <p className="mt-2 text-muted">{m.message}</p>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
