"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPickerDialog } from "@/components/dashboard/media/media-picker-dialog";
import { useMediaLibrary } from "@/components/dashboard/media/media-library-context";

export type CoverValue = { id: string; url: string; altText: string | null };

/** Article cover photo: chosen from the media library (or uploaded from the picker). */
export function CoverField({
  value,
  onChange,
}: {
  value: CoverValue | null;
  onChange: (value: CoverValue | null) => void;
}) {
  const library = useMediaLibrary();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">Cover photo</span>
        <span className="text-xs text-muted-foreground">
          Shown on the news list, the home page and at the top of the article.
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        {value ? (
          <Image
            src={value.url}
            alt={value.altText ?? ""}
            fill
            sizes="288px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden />
            No cover photo
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
      {value && !value.altText ? (
        <p className="text-xs text-muted-foreground">
          Tip: add a description to this photo in the media library.
        </p>
      ) : null}

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        items={library.items}
        onItemsChange={library.setItems}
        canUpload={library.canUpload}
        onSelect={(item) =>
          onChange({ id: item.id, url: item.url, altText: item.altText })
        }
      />
    </div>
  );
}
