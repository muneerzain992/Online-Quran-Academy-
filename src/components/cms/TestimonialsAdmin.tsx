"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";

type Row = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  order: number;
  published: boolean;
};

export function TestimonialsAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    quote: "",
    rating: 5,
    order: 0,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/testimonials");
    const json = await res.json();
    if (json.ok) setRows(json.testimonials);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId ?? undefined, ...form, published: true }),
    });
    setEditId(null);
    setForm({ name: "", location: "", quote: "", rating: 5, order: 0 });
    await load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Testimonial</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <Textarea label="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <Button type="button" onClick={save}>Save</Button>
      </Card>
      <Card>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-border/60 pb-3 text-sm">
              <p className="font-medium">{row.name} — {row.location}</p>
              <p className="mt-1 text-muted line-clamp-2">{row.quote}</p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => {
                  setEditId(row.id);
                  setForm({
                    name: row.name,
                    location: row.location,
                    quote: row.quote,
                    rating: row.rating,
                    order: row.order,
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
