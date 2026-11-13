"use client";

import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import { articleExtensions } from "@/lib/editor/extensions";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./editor-toolbar";

/**
 * Tiptap rich-text editor for articles. Stores content as Tiptap JSON (posts.content).
 * Uses the same extensions as the public article page (src/lib/editor/extensions.ts).
 */
export function RichTextEditor({
  value,
  onChange,
  invalid,
}: {
  value: JSONContent | null;
  onChange: (json: JSONContent) => void;
  invalid?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      ...articleExtensions,
      Placeholder.configure({ placeholder: "Start writing your article…" }),
      CharacterCount,
    ],
    content: value ?? "",
    immediatelyRender: false, // required with server rendering (Next.js)
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-96 px-4 py-3 focus:outline-none prose-headings:font-semibold prose-img:rounded-md",
        "aria-label": "Article content",
      },
    },
  });

  return (
    <div
      aria-invalid={invalid || undefined}
      className={cn(
        "overflow-hidden rounded-lg border bg-background focus-within:ring-3 focus-within:ring-ring/30",
        invalid && "border-destructive",
      )}
    >
      {/* Toolbar + word count mount only once the editor exists, so they read its state
          right away (otherwise they'd wait for the first keystroke). */}
      {editor ? (
        <EditorToolbar editor={editor} />
      ) : (
        <div className="h-11 border-b bg-muted/40" aria-hidden />
      )}
      <EditorContent editor={editor} />
      {editor ? (
        <WordCount editor={editor} />
      ) : (
        <div className="border-t px-3 py-1.5 text-xs">&nbsp;</div>
      )}
    </div>
  );
}

/** Re-renders only when the word count changes (Tiptap v3 doesn't re-render on every keystroke). */
function WordCount({ editor }: { editor: Editor }) {
  const words = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.storage.characterCount.words() ?? 0,
  });
  return (
    <div className="flex justify-end border-t px-3 py-1.5 text-xs text-muted-foreground">
      {words ?? 0} words
    </div>
  );
}
