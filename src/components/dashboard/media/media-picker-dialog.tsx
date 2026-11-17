"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import type { MediaItem } from "@/server/queries/media";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "./upload-dropzone";

/** Choose a photo from the media library (or upload a new one) for a website section. */
export function MediaPickerDialog({
  open,
  onOpenChange,
  items,
  onItemsChange,
  canUpload,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MediaItem[];
  onItemsChange: (items: MediaItem[]) => void;
  canUpload: boolean;
  onSelect: (item: MediaItem) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSelectedId(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a photo</DialogTitle>
          <DialogDescription>
            Pick a photo from the media library
            {canUpload ? " or upload a new one" : ""}.
          </DialogDescription>
        </DialogHeader>

        {canUpload ? (
          <UploadDropzone
            className="p-5"
            onUploaded={(item) => {
              onItemsChange([item, ...items]);
              setSelectedId(item.id);
            }}
          />
        ) : null}

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The media library is empty.
            {canUpload
              ? " Upload a photo above."
              : " Ask an admin to upload photos."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => {
                    onSelect(item);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-lg bg-muted ring-offset-2 ring-offset-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isSelected && "ring-3 ring-primary",
                  )}
                >
                  <Image
                    src={item.url}
                    alt={item.altText ?? item.filename}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {isSelected ? (
                    <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon className="size-4" aria-hidden />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onSelect(selected);
              setSelectedId(null);
              onOpenChange(false);
            }}
          >
            Use this photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
