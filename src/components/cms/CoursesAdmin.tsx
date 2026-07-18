"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { RichTextEditor } from "./RichTextEditor";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  audience: string;
  duration: string;
  level: string;
  order: number;
  published: boolean;
};

const empty: Omit<CourseRow, "id"> = {
  slug: "",
  title: "",
  shortDesc: "",
  longDesc: "<p></p>",
  audience: "",
  duration: "",
  level: "",
  order: 0,
  published: true,
};

export function CoursesAdmin() {
  const [rows, setRows] = useState<CourseRow[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/courses");
    const json = await res.json();
    if (json.ok) setRows(json.courses);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setStatus("Saving…");
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editId ?? undefined }),
    });
    const json = await res.json();
    if (!json.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus("Saved");
    setForm(empty);
    setEditId(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          {editId ? "Edit course" : "New course"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Audience" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
          <Input label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input label="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <Input label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
        <Input label="Short description" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
        <div>
          <p className="mb-1.5 text-sm font-medium">Long description</p>
          <RichTextEditor value={form.longDesc} onChange={(html) => setForm({ ...form, longDesc: html })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <div className="flex gap-2">
          <Button type="button" onClick={save}>Save</Button>
          {editId ? (
            <Button type="button" variant="ghost" onClick={() => { setEditId(null); setForm(empty); }}>
              Cancel
            </Button>
          ) : null}
        </div>
        {status ? <p className="text-xs text-cyan">{status}</p> : null}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold">All courses</h2>
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm">
              <span>
                {row.title}{" "}
                <span className="text-muted">/{row.slug}</span>
                {!row.published ? <span className="ml-2 text-gold">(draft)</span> : null}
              </span>
              <span className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditId(row.id);
                    setForm({
                      slug: row.slug,
                      title: row.title,
                      shortDesc: row.shortDesc,
                      longDesc: row.longDesc,
                      audience: row.audience,
                      duration: row.duration,
                      level: row.level,
                      order: row.order,
                      published: row.published,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => remove(row.id)}>
                  Delete
                </Button>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
