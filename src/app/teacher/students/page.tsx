import type { Metadata } from "next";
import { auth } from "@/auth";
import { Card, Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { AddProgressNoteForm } from "@/components/dashboard/AddProgressNoteForm";

export const metadata: Metadata = { title: "Students" };

export default async function TeacherStudentsPage() {
  const session = await auth();
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Assigned students
        </h2>
        <ul className="mt-4 space-y-3">
          {students.length === 0 ? (
            <li className="text-sm text-muted">No students registered yet.</li>
          ) : (
            students.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm"
              >
                <span className="text-foreground">
                  {s.name ?? "Student"} · {s.email}
                </span>
              </li>
            ))
          )}
        </ul>
      </Card>

      {session?.user?.id && students[0] ? (
        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Add progress note
          </h2>
          <AddProgressNoteForm
            teacherUserId={session.user.id}
            students={students.map((s) => ({
              id: s.id,
              label: s.name ?? s.email,
            }))}
          />
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-muted">
            Register a student account to start adding progress notes.
          </p>
          <Button href="/register" className="mt-4" variant="secondary">
            Open registration
          </Button>
        </Card>
      )}
    </div>
  );
}
