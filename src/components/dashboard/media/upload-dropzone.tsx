"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import type { MediaItem } from "@/server/queries/media";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "./upload-image";

/**
 * Drag & drop (or click) to upload one or several images to the media library.
 * Images are compressed on the server (max 2400 px, WebP) before being stored.
 */
export function UploadDropzone({
  onUploaded,
  className,
}: {
  /** Called for each uploaded image (e.g. to select it in a picker). */
  onUploaded?: (item: MediaItem) => void;
  className?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0 || progress) return;

    let ok = 0;
    setProgress({ done: 0, total: files.length });
    for (const [i, file] of files.entries()) {
      try {
        const item = await uploadImage(file);
        onUploaded?.(item);
        ok++;
      } catch (error) {
        toast.error(`${file.name}: ${(error as Error).message}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (ok > 0) {
      toast.success(ok === 1 ? "Photo uploaded" : `${ok} photos uploaded`);
      router.refresh();
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border",
        className,
      )}
    >
      {progress ? (
        <>
          <LoaderCircleIcon
            className="size-8 animate-spin text-primary"
            aria-hidden
          />
          <p className="text-sm font-medium" aria-live="polite">
            Uploading{" "}
            {progress.done + 1 > progress.total
              ? progress.total
              : progress.done + 1}{" "}
            of {progress.total}…
          </p>
        </>
      ) : (
        <>
          <ImageUpIcon className="size-8 text-muted-foreground" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Drag photos here</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP, up to 15 MB each. They are compressed
              automatically.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            Choose files
          </Button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
