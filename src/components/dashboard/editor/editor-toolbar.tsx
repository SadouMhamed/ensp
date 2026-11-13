"use client";

import { useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Item = {
  label: string;
  icon: React.ComponentType;
  isActive: (e: Editor) => boolean;
  run: (e: Editor) => void;
};

const groups: Item[][] = [
  [
    {
      label: "Bold",
      icon: BoldIcon,
      isActive: (e) => e.isActive("bold"),
      run: (e) => e.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      isActive: (e) => e.isActive("italic"),
      run: (e) => e.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      isActive: (e) => e.isActive("underline"),
      run: (e) => e.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      icon: StrikethroughIcon,
      isActive: (e) => e.isActive("strike"),
      run: (e) => e.chain().focus().toggleStrike().run(),
    },
  ],
  [
    {
      label: "Heading",
      icon: Heading2Icon,
      isActive: (e) => e.isActive("heading", { level: 2 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Subheading",
      icon: Heading3Icon,
      isActive: (e) => e.isActive("heading", { level: 3 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "Bullet list",
      icon: ListIcon,
      isActive: (e) => e.isActive("bulletList"),
      run: (e) => e.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrderedIcon,
      isActive: (e) => e.isActive("orderedList"),
      run: (e) => e.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      icon: QuoteIcon,
      isActive: (e) => e.isActive("blockquote"),
      run: (e) => e.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code block",
      icon: CodeIcon,
      isActive: (e) => e.isActive("codeBlock"),
      run: (e) => e.chain().focus().toggleCodeBlock().run(),
    },
  ],
];

/** Formatting toolbar. Re-renders only when the active formats change. */
export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            active: groups.flat().map((item) => item.isActive(e)),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  if (!editor || !state) {
    return <div className="h-11 border-b bg-muted/40" aria-hidden />;
  }

  let i = 0;
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5"
      // Keep the cursor in the editor when a toolbar button is clicked. Otherwise the
      // editor blurs, then restores an old selection and forgets "bold on" etc.
      // (Only for elements really inside the toolbar: popover inputs live in a portal.)
      onMouseDown={(e) => {
        if (e.currentTarget.contains(e.target as Node)) e.preventDefault();
      }}
    >
      {groups.map((group, g) => (
        <div key={g} className="flex items-center gap-1">
          {g > 0 ? (
            <Separator orientation="vertical" className="mx-1 h-5" />
          ) : null}
          {group.map((item) => {
            const pressed = state.active[i++];
            return (
              <ToolbarToggle
                key={item.label}
                label={item.label}
                pressed={pressed}
                onPressedChange={() => item.run(editor)}
              >
                <item.icon />
              </ToolbarToggle>
            );
          })}
        </div>
      ))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      <LinkButton editor={editor} active={state.link} />
      <ImageButton editor={editor} />
      <ToolbarToggle
        label="Divider line"
        pressed={false}
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <MinusIcon />
      </ToolbarToggle>
      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Undo"
          disabled={!state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2Icon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Redo"
          disabled={!state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2Icon />
        </Button>
      </div>
    </div>
  );
}

function ToolbarToggle({
  label,
  pressed,
  onPressedChange,
  children,
}: {
  label: string;
  pressed: boolean;
  onPressedChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            size="sm"
            aria-label={label}
            pressed={pressed}
            onPressedChange={onPressedChange}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function onOpenChange(next: boolean) {
    if (next) setUrl(editor.getAttributes("link").href ?? "");
    setOpen(next);
  }

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (url.trim()) chain.setLink({ href: url.trim() }).run();
    else chain.unsetLink().run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={<Toggle size="sm" aria-label="Link" pressed={active} />}
      >
        <LinkIcon />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={apply}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="editor-link">Link address</FieldLabel>
              <Input
                id="editor-link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
              />
            </Field>
            <div className="flex justify-end gap-2">
              {active ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                    setOpen(false);
                  }}
                >
                  Remove link
                </Button>
              ) : null}
              <Button type="submit" size="sm">
                Apply
              </Button>
            </div>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function ImageButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  function insert(e: React.FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\//.test(src.trim())) return;
    editor.chain().focus().setImage({ src: src.trim(), alt: alt.trim() }).run();
    setSrc("");
    setAlt("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Toggle size="sm" aria-label="Image" pressed={false} />}
      >
        <ImageIcon />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={insert}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="editor-image">
                Image address (URL)
              </FieldLabel>
              <Input
                id="editor-image"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="https://…/photo.jpg"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="editor-image-alt">
                Description (for accessibility)
              </FieldLabel>
              <Input
                id="editor-image-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </Field>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!/^https?:\/\//.test(src.trim())}
              >
                Insert image
              </Button>
            </div>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}
