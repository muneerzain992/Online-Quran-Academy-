"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";

type PlanRow = {
  id: string;
  name: string;
  priceUsd: number;
  classesPerWeek: number;
  minutesPerClass: number;
  features: string[];
  stripePriceId: string | null;
  popular: boolean;
};

export function PlansAdmin() {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    priceUsd: 50,
    classesPerWeek: 3,
    minutesPerClass: 30,
    features: "",
    stripePriceId: "",
    popular: false,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/plans");
    const json = await res.json();
    if (json.ok) setRows(json.plans);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    await fetch("/api/admin/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId ?? undefined,
        name: form.name,
        priceUsd: form.priceUsd,
        classesPerWeek: form.classesPerWeek,
        minutesPerClass: form.minutesPerClass,
        features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
        stripePriceId: form.stripePriceId || null,
        popular: form.popular,
      }),
    });
    setEditId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Pricing plan</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Price USD" type="number" value={form.priceUsd} onChange={(e) => setForm({ ...form, priceUsd: Number(e.target.value) })} />
          <Input label="Classes / week" type="number" value={form.classesPerWeek} onChange={(e) => setForm({ ...form, classesPerWeek: Number(e.target.value) })} />
          <Input label="Minutes / class" type="number" value={form.minutesPerClass} onChange={(e) => setForm({ ...form, minutesPerClass: Number(e.target.value) })} />
        </div>
        <Input label="Features (comma-separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <Input label="Stripe Price ID (optional)" value={form.stripePriceId} onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
          Most popular
        </label>
        <Button type="button" onClick={save}>Save plan</Button>
      </Card>
      <Card>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="flex justify-between border-b border-border/60 pb-3 text-sm">
              <span>
                {row.name} — ${row.priceUsd}/mo
                {row.popular ? " ★" : ""}
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditId(row.id);
                  setForm({
                    name: row.name,
                    priceUsd: row.priceUsd,
                    classesPerWeek: row.classesPerWeek,
                    minutesPerClass: row.minutesPerClass,
                    features: row.features.join(", "),
                    stripePriceId: row.stripePriceId ?? "",
                    popular: row.popular,
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
