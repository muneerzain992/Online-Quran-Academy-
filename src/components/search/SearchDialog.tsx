"use client";

import { BookOpen, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Hit = {
  type: "course" | "post";
  title: string;
  excerpt: string;
  href: string;
  tags?: string[];
};

export function SearchDialog() {
  const t = useTranslations("Search");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setHits([]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setHits([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const json = await res.json();
        if (json.ok) setHits(json.results ?? []);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => window.clearTimeout(handle);
  }, [q, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg px-2 text-muted hover:bg-surface-elevated hover:text-foreground"
        aria-label={t("label")}
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden text-xs sm:inline">{t("label").split(" ")[0]}</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted md:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-navy/70 px-3 pt-[max(4rem,10vh)] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                id={titleId}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("placeholder")}
                className="w-full bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={close}
                className="focus-ring rounded-lg p-1.5 text-muted hover:text-foreground"
                aria-label={t("close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {q.trim().length < 2 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">{t("hint")}</p>
              ) : loading ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  {t("searching")}
                </p>
              ) : hits.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  {t("empty", { query: q.trim() })}
                </p>
              ) : (
                <ul className="space-y-1">
                  {hits.map((hit) => (
                    <li key={hit.type + hit.href}>
                      <Link
                        href={hit.href}
                        onClick={close}
                        className={cn(
                          "focus-ring flex gap-3 rounded-xl px-3 py-2.5 transition-colors",
                          "hover:bg-royal/10",
                        )}
                      >
                        <span className="mt-0.5 text-sky">
                          {hit.type === "course" ? (
                            <BookOpen className="h-4 w-4" aria-hidden />
                          ) : (
                            <FileText className="h-4 w-4" aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">
                            {hit.title}
                          </span>
                          <span className="mt-0.5 line-clamp-1 block text-xs text-muted">
                            {hit.type === "course" ? t("course") : t("blog")} ·{" "}
                            {hit.excerpt}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border px-3 py-2 text-[10px] text-muted">
              <Link href="/blog" onClick={close} className="hover:text-sky">
                {t("browseBlog")}
              </Link>
              {" · "}
              <Link href="/courses" onClick={close} className="hover:text-sky">
                {t("allCourses")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
