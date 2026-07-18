"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { RichTextEditor } from "./RichTextEditor";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
};

const empty: Omit<PostRow, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  contentHtml: "<p></p>",
  coverImage: "",
  tags: [],
  published: false,
  publishedAt: null,
};

export function PostsAdmin() {
  const [rows, setRows] = useState<PostRow[]>([]);
  const [form, setForm] = useState({ ...empty, coverImage: "", tagsText: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/posts");
    const json = await res.json();
    if (json.ok) setRows(json.posts);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setStatus("Saving…");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId ?? undefined,
        slug: form.slug || undefined,
        title: form.title,
        excerpt: form.excerpt,
        contentHtml: form.contentHtml,
        coverImage: form.coverImage || null,
        tags: form.tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published: form.published,
        publishedAt: form.publishedAt,
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus("Saved");
    setForm({ ...empty, coverImage: "", tagsText: "" });
    setEditId(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/admin/posts", {
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
          {editId ? "Edit post" : "New blog post"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto from title"
          />
          <Input
            label="Cover image URL"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          <Input
            label="Tags (comma-separated)"
            value={form.tagsText}
            onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
            placeholder="tajweed, parents"
          />
        </div>
        <Input
          label="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <div>
          <p className="mb-1.5 text-sm font-medium">Content</p>
          <RichTextEditor
            value={form.contentHtml}
            onChange={(html) => setForm({ ...form, contentHtml: html })}
            placeholder="Write your article…"
          />
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
          <Button type="button" onClick={save}>
            Save
          </Button>
          {editId ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditId(null);
                setForm({ ...empty, coverImage: "", tagsText: "" });
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
        {status ? <p className="text-xs text-cyan">{status}</p> : null}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold">All posts</h2>
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm"
            >
              <span>
                {row.title}{" "}
                <span className="text-muted">
                  /{row.slug}
                  {row.published ? "" : " · draft"}
                </span>
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditId(row.id);
                    setForm({
                      ...row,
                      coverImage: row.coverImage ?? "",
                      tagsText: row.tags.join(", "),
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(row.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {!rows.length ? (
            <li className="text-sm text-muted">No posts yet.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
