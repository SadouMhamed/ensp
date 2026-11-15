"use client";

import {
  createContext,
  use,
  useId,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  ImageIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import type { MediaItem } from "@/server/queries/media";
import { resetSection, saveSection } from "@/server/actions/sections";
import {
  SECTIONS,
  type SectionContent,
  type SectionImage,
  type SectionKey,
} from "@/lib/validations/sections";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MediaPickerDialog } from "@/components/dashboard/media/media-picker-dialog";

/**
 * Shared building blocks for the website section editors:
 * the media library context, the editor state hook + save bar, and form fields.
 */

// ── Media library (for the photo fields) ─────────────────────────

type MediaLibrary = {
  items: MediaItem[];
  setItems: (items: MediaItem[]) => void;
  canUpload: boolean;
};
const MediaLibraryContext = createContext<MediaLibrary | null>(null);

export function MediaLibraryProvider({
  initial,
  canUpload,
  children,
}: {
  initial: MediaItem[];
  canUpload: boolean;
  children: ReactNode;
}) {
  const [items, setItems] = useState(initial);
  return (
    <MediaLibraryContext value={{ items, setItems, canUpload }}>
      {children}
    </MediaLibraryContext>
  );
}

// ── Editor state + save bar ──────────────────────────────────────

export type SectionEditorProps<K extends SectionKey> = {
  initial: SectionContent<K>;
  initialVisible: boolean;
  isCustomized: boolean;
};

export function useSectionEditor<K extends SectionKey>(
  key: K,
  { initial, initialVisible, isCustomized }: SectionEditorProps<K>,
) {
  const [content, setContent] = useState<SectionContent<K>>(initial);
  const [visible, setVisible] = useState(initialVisible);
  const [saved, setSaved] = useState({
    content: initial,
    visible: initialVisible,
  });
  const [customized, setCustomized] = useState(isCustomized);
  const [pending, startTransition] = useTransition();

  const dirty =
    visible !== saved.visible ||
    JSON.stringify(content) !== JSON.stringify(saved.content);

  /** Change some top-level fields. */
  function update(patch: Partial<SectionContent<K>>) {
    setContent((c) => ({ ...c, ...patch }));
  }

  function save() {
    const parsed = SECTIONS[key].schema.safeParse(content);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      const result = await saveSection(
        key,
        parsed.data as SectionContent<K>,
        visible,
      );
      if (result.ok) {
        setSaved({ content, visible });
        setCustomized(true);
        toast.success("Saved. The website is updated.");
      } else {
        toast.error(result.error);
      }
    });
  }

  function discard() {
    setContent(saved.content);
    setVisible(saved.visible);
  }

  function restore(onDone: () => void) {
    startTransition(async () => {
      const result = await resetSection(key);
      if (result.ok) {
        const original = SECTIONS[key].defaults as SectionContent<K>;
        setContent(original);
        setVisible(true);
        setSaved({ content: original, visible: true });
        setCustomized(false);
        onDone();
        toast.success("Original content restored on the website.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return {
    key,
    content,
    setContent,
    update,
    visible,
    setVisible,
    dirty,
    customized,
    pending,
    save,
    discard,
    restore,
  };
}

export type SectionEditorState<K extends SectionKey> = ReturnType<
  typeof useSectionEditor<K>
>;

export function SaveBar<K extends SectionKey>({
  editor,
  previewHref = "/",
}: {
  editor: SectionEditorState<K>;
  previewHref?: string;
}) {
  const [restoreOpen, setRestoreOpen] = useState(false);
  const def = SECTIONS[editor.key];

  return (
    <>
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
        {def.hideable ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${editor.key}-visible`}
              checked={editor.visible}
              onCheckedChange={(v) => editor.setVisible(v === true)}
            />
            <Label htmlFor={`${editor.key}-visible`}>
              Show this section on the website
            </Label>
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-2">
          {editor.dirty ? (
            <span className="text-xs text-muted-foreground">
              Unsaved changes
            </span>
          ) : null}
          {editor.customized ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={editor.pending}
              onClick={() => setRestoreOpen(true)}
            >
              Restore original
            </Button>
          ) : null}
          <Link
            href={previewHref}
            target="_blank"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View website
            <ExternalLinkIcon data-icon="inline-end" />
          </Link>
          <Button
            type="button"
            variant="outline"
            disabled={!editor.dirty || editor.pending}
            onClick={editor.discard}
          >
            Discard
          </Button>
          <Button
            type="button"
            disabled={!editor.dirty || editor.pending}
            onClick={editor.save}
          >
            {editor.pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <AlertDialog open={restoreOpen} onOpenChange={setRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore the original content?</AlertDialogTitle>
            <AlertDialogDescription>
              Your saved version of “{def.title}” will be replaced by the
              original texts and photos of the website. Photos stay in the media
              library. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={editor.pending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={editor.pending}
              onClick={() => editor.restore(() => setRestoreOpen(false))}
            >
              {editor.pending ? "Restoring…" : "Restore original"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Layout ───────────────────────────────────────────────────────

/** A titled group of fields. */
export function EditorCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-1">{actions}</div> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

// ── Fields ───────────────────────────────────────────────────────

function FieldLabel({
  id,
  label,
  length,
  max,
}: {
  id: string;
  label: string;
  length: number;
  max: number;
}) {
  return (
    <div className="flex justify-between gap-2">
      <Label htmlFor={id}>{label}</Label>
      <span
        className={cn(
          "text-xs tabular-nums text-muted-foreground",
          length > max * 0.9 && "text-destructive",
        )}
      >
        {length}/{max}
      </span>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  max,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  placeholder?: string;
  type?: "text" | "email" | "url" | "tel";
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} length={value.length} max={max} />
      <Input
        id={id}
        type={type}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  max,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  rows?: number;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} length={value.length} max={max} />
      <Textarea
        id={id}
        value={value}
        maxLength={max}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Photo with preview, "Choose / Change", "Remove" and its description. */
export function ImageField({
  label = "Photo",
  value,
  onChange,
  aspect = "aspect-video",
  emptyHint = "No photo (placeholder shown)",
}: {
  label?: string;
  value: SectionImage | null;
  onChange: (value: SectionImage | null) => void;
  aspect?: string;
  emptyHint?: string;
}) {
  const library = use(MediaLibraryContext);
  const [open, setOpen] = useState(false);
  const altId = useId();
  if (!library) throw new Error("ImageField needs a MediaLibraryProvider");

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{label}</span>
      <div
        className={cn("relative overflow-hidden rounded-lg bg-muted", aspect)}
      >
        {value ? (
          <Image
            src={value.url}
            alt={value.alt}
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-xs text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden />
            {emptyHint}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          {value ? "Change photo" : "Choose photo"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        ) : null}
      </div>
      {value ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={altId} className="text-xs">
            Photo description
          </Label>
          <Input
            id={altId}
            value={value.alt}
            maxLength={300}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </div>
      ) : null}

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        items={library.items}
        onItemsChange={library.setItems}
        canUpload={library.canUpload}
        onSelect={(item) =>
          onChange({ url: item.url, alt: item.altText ?? "", mediaId: item.id })
        }
      />
    </div>
  );
}

// ── Lists ────────────────────────────────────────────────────────

function move<T>(list: T[], index: number, delta: -1 | 1) {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + delta, 0, item);
  return next;
}

function ItemButtons({
  label,
  index,
  count,
  min,
  onMove,
  onDelete,
}: {
  label: string;
  index: number;
  count: number;
  min: number;
  onMove: (delta: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(-1)}
      >
        <ArrowUpIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Move ${label} down`}
        disabled={index === count - 1}
        onClick={() => onMove(1)}
      >
        <ArrowDownIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${label}`}
        disabled={count <= min}
        onClick={onDelete}
      >
        <Trash2Icon />
      </Button>
    </>
  );
}

/** A list of cards (slides, steps, locations…): add, delete, reorder. Items need an `id`. */
export function CardList<T extends { id: string }>({
  items,
  onChange,
  itemName,
  min = 0,
  max,
  create,
  children,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  /** e.g. "Slide" → "Slide 1 of 5", "Add a slide" */
  itemName: string;
  min?: number;
  max: number;
  create: () => Omit<T, "id">;
  children: (
    item: T,
    update: (patch: Partial<T>) => void,
    index: number,
  ) => ReactNode;
}) {
  const lower = itemName.toLowerCase();
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <EditorCard
          key={item.id}
          title={
            <>
              {itemName} {i + 1}
              <span className="font-normal text-muted-foreground">
                {" "}
                of {items.length}
              </span>
            </>
          }
          actions={
            <ItemButtons
              label={`${lower} ${i + 1}`}
              index={i}
              count={items.length}
              min={min}
              onMove={(d) => onChange(move(items, i, d))}
              onDelete={() => onChange(items.filter((x) => x.id !== item.id))}
            />
          }
        >
          {children(
            item,
            (patch) =>
              onChange(
                items.map((x) => (x.id === item.id ? { ...x, ...patch } : x)),
              ),
            i,
          )}
        </EditorCard>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={items.length >= max}
        onClick={() =>
          onChange([...items, { ...create(), id: crypto.randomUUID() } as T])
        }
      >
        <PlusIcon data-icon="inline-start" />
        Add {/^[aeiou]/i.test(itemName) ? "an" : "a"} {lower}
        {items.length >= max ? ` (${max} max)` : ""}
      </Button>
    </div>
  );
}

/** A list of texts (paragraphs, bullet points): add, delete, reorder. */
export function TextList({
  label,
  items,
  onChange,
  itemName,
  min = 0,
  max,
  itemMax,
  multiline = true,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  itemName: string;
  min?: number;
  max: number;
  itemMax: number;
  multiline?: boolean;
}) {
  const baseId = useId();
  const lower = itemName.toLowerCase();
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {items.map((value, i) => {
        const id = `${baseId}-${i}`;
        return (
          // Index key: texts can repeat and have no id.
          <div key={i} className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex justify-between">
                <Label htmlFor={id} className="text-xs text-muted-foreground">
                  {itemName} {i + 1}
                </Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {value.length}/{itemMax}
                </span>
              </div>
              {multiline ? (
                <Textarea
                  id={id}
                  value={value}
                  maxLength={itemMax}
                  rows={3}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                />
              ) : (
                <Input
                  id={id}
                  value={value}
                  maxLength={itemMax}
                  onChange={(e) =>
                    onChange(
                      items.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                />
              )}
            </div>
            <div className="flex flex-col pt-5">
              <ItemButtons
                label={`${lower} ${i + 1}`}
                index={i}
                count={items.length}
                min={min}
                onMove={(d) => onChange(move(items, i, d))}
                onDelete={() => onChange(items.filter((_, j) => j !== i))}
              />
            </div>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={items.length >= max}
        onClick={() => onChange([...items, ""])}
      >
        <PlusIcon data-icon="inline-start" />
        Add {/^[aeiou]/i.test(itemName) ? "an" : "a"} {lower}
        {items.length >= max ? ` (${max} max)` : ""}
      </Button>
    </fieldset>
  );
}
