"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImagesIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import type { MediaItem } from "@/server/queries/media";
import { deleteMedia, updateMediaAlt } from "@/server/actions/media";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatBytes } from "./upload-image";

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImagesIcon />
          </EmptyMedia>
          <EmptyTitle>No photos yet</EmptyTitle>
          <EmptyDescription>
            Upload photos above. You can then use them in the website sections.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const [alt, setAlt] = useState(item.altText ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const altId = `alt-${item.id}`;

  function saveAlt() {
    if (alt.trim() === (item.altText ?? "")) return;
    startSaving(async () => {
      const result = await updateMediaAlt(item.id, alt);
      if (result.ok) toast.success("Description saved");
      else toast.error(result.error);
    });
  }

  function confirmDelete() {
    startDeleting(async () => {
      const result = await deleteMedia(item.id);
      if (result.ok) {
        toast.success("Photo deleted");
        setConfirmOpen(false);
      } else {
        toast.error(result.error);
        setConfirmOpen(false);
      }
    });
  }

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={item.url}
          alt={item.altText ?? ""}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={item.filename}>
              {item.filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.width && item.height
                ? `${item.width}×${item.height} · `
                : ""}
              {formatBytes(item.size)} ·{" "}
              {dateFormat.format(new Date(item.createdAt))}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${item.filename}`}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={altId} className="text-xs">
            Description (for Google and screen readers)
          </Label>
          <Input
            id={altId}
            value={alt}
            maxLength={300}
            placeholder="e.g. ENSP team in front of a drilling rig"
            disabled={saving}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={saveAlt}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              {item.filename} will be removed from the media library. If a
              website section or an article&apos;s text still uses it,
              you&apos;ll be asked to remove it there first. If it is an article
              cover, the article simply loses its cover. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete photo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
