"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Select, Textarea } from "@/components/ui";

export function AddProgressNoteForm({
  teacherUserId,
  students,
}: {
  teacherUserId: string;
  students: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [studentUserId, setStudentUserId] = useState(students[0]?.id ?? "");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/progress-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUserId, teacherUserId, content }),
      });
      if (!res.ok) throw new Error("Failed");
      setContent("");
      setStatus("ok");
      router.refresh();
    } catch {
      setStatus("err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Select
        label="Student"
        value={studentUserId}
        onChange={(e) => setStudentUserId(e.target.value)}
        options={students.map((s) => ({ value: s.id, label: s.label }))}
      />
      <Textarea
        label="Note"
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Attendance, Tajweed focus, revision…"
      />
      {status === "ok" ? (
        <p className="text-sm text-cyan">Note saved.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-400">Could not save note.</p>
      ) : null}
      <Button type="submit" disabled={loading || !studentUserId}>
        {loading ? "Saving…" : "Save note"}
      </Button>
    </form>
  );
}
