"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";

type TeacherRow = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  gender: "FEMALE" | "MALE";
  certifications: string[];
  subjects: string[];
  rating: number;
  active: boolean;
};

export function TeachersAdmin() {
  const [rows, setRows] = useState<TeacherRow[]>([]);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    bio: "",
    gender: "FEMALE",
    certifications: "",
    subjects: "",
    rating: 5,
    active: true,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/teachers");
    const json = await res.json();
    if (json.ok) setRows(json.teachers);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId ?? undefined,
        slug: form.slug,
        name: form.name,
        bio: form.bio,
        gender: form.gender,
        certifications: form.certifications.split(",").map((s) => s.trim()).filter(Boolean),
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        rating: form.rating,
        active: form.active,
      }),
    });
    setEditId(null);
    setForm({
      slug: "",
      name: "",
      bio: "",
      gender: "FEMALE",
      certifications: "",
      subjects: "",
      rating: 5,
      active: true,
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          {editId ? "Edit teacher" : "New teacher"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            options={[
              { value: "FEMALE", label: "Female" },
              { value: "MALE", label: "Male" },
            ]}
          />
          <Input label="Rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </div>
        <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <Input label="Subjects (comma-separated)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
        <Input label="Certifications (comma-separated)" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
        <Button type="button" onClick={save}>Save teacher</Button>
      </Card>
      <Card>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap justify-between gap-2 border-b border-border/60 pb-3 text-sm">
              <span>{row.name} · {row.gender}</span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditId(row.id);
                  setForm({
                    slug: row.slug,
                    name: row.name,
                    bio: row.bio,
                    gender: row.gender,
                    certifications: row.certifications.join(", "),
                    subjects: row.subjects.join(", "),
                    rating: row.rating,
                    active: row.active,
                  });
                }}
              >
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
