"use client";

import { createContext, use, useState, type ReactNode } from "react";
import type { MediaItem } from "@/server/queries/media";

/**
 * The media library, shared by every photo picker of a dashboard page
 * (website sections, article cover, photos inside an article).
 * Photos uploaded from a picker are added here so the other pickers see them too.
 */
type MediaLibrary = {
  items: MediaItem[];
  setItems: (items: MediaItem[]) => void;
  /** false when the user doesn't have the "Media library" privilege */
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

export function useMediaLibrary() {
  const library = use(MediaLibraryContext);
  if (!library) throw new Error("useMediaLibrary needs a MediaLibraryProvider");
  return library;
}
