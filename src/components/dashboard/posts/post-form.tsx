"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deletePost, savePost } from "@/server/actions/posts";
import { postSchema, slugify } from "@/lib/validations/post";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RichTextEditor } from "../editor/rich-text-editor";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: JSONContent | null;
  status: "draft" | "published";
};

const empty: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: null,
  status: "draft",
};

/** Create / edit an article. Content is written with the Tiptap editor. */
export function PostForm({ initial = empty }: { initial?: PostFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  // Keep the address in sync with the title until the user edits the address themselves.
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const isEdit = Boolean(values.id);

  const set = <K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K],
  ) => setValues((v) => ({ ...v, [key]: value }));

  function onTitleChange(title: string) {
    setValues((v) => ({
      ...v,
      title,
      slug: slugTouched ? v.slug : slugify(title),
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = postSchema.safeParse({
      ...values,
      excerpt: values.excerpt || undefined,
    });
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError(null);
    startSaving(async () => {
      const result = await savePost({ ...parsed.data, id: values.id });
      if (!result.ok) return setError(result.error);
      toast.success(
        values.status === "published" ? "Article published" : "Draft saved",
      );
      if (!isEdit) router.replace(`/dashboard/posts/${result.id}`);
      else router.refresh();
      setValues((v) => ({ ...v, id: result.id }));
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      {/* Main column: title, address, editor */}
      <FieldGroup>
        <Field
          data-invalid={error?.toLowerCase().includes("title") || undefined}
        >
          <FieldLabel htmlFor="post-title">Title</FieldLabel>
          <Input
            id="post-title"
            value={values.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. ENSP completes a new well testing campaign"
            className="h-11 text-lg"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="post-slug">Web address</FieldLabel>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="shrink-0">/blog/</span>
            <Input
              id="post-slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set(
                  "slug",
                  slugify(e.target.value) || e.target.value.toLowerCase(),
                );
              }}
              placeholder="article-address"
              required
            />
          </div>
          <FieldDescription>
            Generated from the title. Lowercase letters, numbers and dashes.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Content</FieldLabel>
          <RichTextEditor
            value={values.content}
            onChange={(json) => set("content", json)}
          />
        </Field>
      </FieldGroup>

      {/* Side column: publish settings */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
        <FieldGroup className="rounded-lg border p-4">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <ToggleGroup
              variant="outline"
              value={[values.status]}
              onValueChange={(v: string[]) =>
                v[0] && set("status", v[0] as PostFormValues["status"])
              }
              className="w-full"
            >
              <ToggleGroupItem value="draft" className="flex-1">
                Draft
              </ToggleGroupItem>
              <ToggleGroupItem value="published" className="flex-1">
                Published
              </ToggleGroupItem>
            </ToggleGroup>
            <FieldDescription>
              {values.status === "published"
                ? "Visible on the website."
                : "Only visible in the dashboard."}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="post-excerpt">Summary</FieldLabel>
            <Textarea
              id="post-excerpt"
              value={values.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="One or two sentences shown on the news list."
              rows={4}
              maxLength={500}
            />
          </Field>
          {error ? <FieldError>{error}</FieldError> : null}
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : values.status === "published"
                ? "Save & publish"
                : "Save draft"}
          </Button>
        </FieldGroup>

        {isEdit ? (
          <div className="flex flex-col gap-2">
            {initial.status === "published" ? (
              <Link
                href={`/blog/${initial.slug}`}
                target="_blank"
                className={buttonVariants({ variant: "outline" })}
              >
                <ExternalLinkIcon data-icon="inline-start" />
                View on website
              </Link>
            ) : null}
            <DeleteButton id={values.id!} title={values.title} />
          </div>
        ) : null}
      </div>
    </form>
  );
}

function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" />}
      >
        <Trash2Icon data-icon="inline-start" />
        Delete article
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this article?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{title || "Untitled"}&rdquo; will be removed from the
            dashboard and the website. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await deletePost(id);
                if (!result.ok) return void toast.error(result.error);
                toast.success("Article deleted");
                router.replace("/dashboard/posts");
              })
            }
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
