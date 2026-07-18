"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { RichTextEditor, htmlToPlain } from "./RichTextEditor";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export function FaqsAdmin() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("<p></p>");
  const [order, setOrder] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/faqs");
    const json = await res.json();
    if (json.ok) setRows(json.faqs);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId ?? undefined,
        question,
        answer: htmlToPlain(answer) || answer,
        order,
        published: true,
      }),
    });
    setQuestion("");
    setAnswer("<p></p>");
    setOrder(0);
    setEditId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          {editId ? "Edit FAQ" : "New FAQ"}
        </h2>
        <Input label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <div>
          <p className="mb-1.5 text-sm font-medium">Answer</p>
          <RichTextEditor value={answer} onChange={setAnswer} />
        </div>
        <Input label="Order" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        <Button type="button" onClick={save}>Save FAQ</Button>
      </Card>
      <Card>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-border/60 pb-3 text-sm">
              <p className="font-medium text-foreground">{row.question}</p>
              <p className="mt-1 text-muted line-clamp-2">{row.answer}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditId(row.id);
                    setQuestion(row.question);
                    setAnswer(`<p>${row.answer}</p>`);
                    setOrder(row.order);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await fetch("/api/admin/faqs", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: row.id }),
                    });
                    await load();
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
