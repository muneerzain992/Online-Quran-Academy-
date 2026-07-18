import type { Metadata } from "next";
import { auth } from "@/auth";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Progress" };

export default async function StudentProgressPage() {
  const session = await auth();
  const notes = session?.user?.id
    ? await prisma.progressNote.findMany({
        where: { studentUserId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-foreground">
        Progress notes
      </h2>
      <ul className="mt-6 space-y-4">
        {notes.length === 0 ? (
          <li className="text-sm text-muted">No notes yet.</li>
        ) : (
          notes.map((n) => (
            <li key={n.id} className="border-b border-border/60 pb-4 text-sm">
              <p className="text-foreground">{n.content}</p>
              <p className="mt-1 text-xs text-muted">
                {n.createdAt.toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
