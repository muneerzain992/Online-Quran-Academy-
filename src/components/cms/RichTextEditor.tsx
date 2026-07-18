"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[160px] px-3 py-2 text-sm focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface/40", className)}>
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {(
          [
            ["Bold", () => editor.chain().focus().toggleBold().run()],
            ["Italic", () => editor.chain().focus().toggleItalic().run()],
            ["H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
            ["List", () => editor.chain().focus().toggleBulletList().run()],
            ["Quote", () => editor.chain().focus().toggleBlockquote().run()],
          ] as const
        ).map(([label, action]) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="rounded-lg px-2 py-1 text-xs text-muted hover:bg-white/10 hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

/** Strip HTML to plain text for short fields when needed */
export function htmlToPlain(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
