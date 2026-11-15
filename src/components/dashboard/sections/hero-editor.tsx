"use client";

import { useState, useTransition } from "react";
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
import { resetHeroSection, saveHeroSection } from "@/server/actions/sections";
import {
  HERO_MAX_SLIDES,
  heroDefault,
  heroSchema,
  type HeroContent,
  type HeroSlide,
} from "@/lib/validations/sections";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPickerDialog } from "@/components/dashboard/media/media-picker-dialog";

/** Dashboard editor for the home page hero: slides (photo, title, text), order, visibility. */
export function HeroEditor({
  initial,
  initialVisible,
  isCustomized,
  media,
  canUpload,
}: {
  initial: HeroContent;
  initialVisible: boolean;
  /** true when a saved version exists (otherwise the original content is shown) */
  isCustomized: boolean;
  media: MediaItem[];
  canUpload: boolean;
}) {
  const [slides, setSlides] = useState<HeroSlide[]>(initial.slides);
  const [visible, setVisible] = useState(initialVisible);
  const [library, setLibrary] = useState(media);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState({
    slides: initial.slides,
    visible: initialVisible,
  });
  const [customized, setCustomized] = useState(isCustomized);
  const [resetOpen, setResetOpen] = useState(false);

  const dirty =
    visible !== saved.visible ||
    JSON.stringify(slides) !== JSON.stringify(saved.slides);

  function update(id: string, patch: Partial<HeroSlide>) {
    setSlides((list) =>
      list.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function move(index: number, delta: -1 | 1) {
    setSlides((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });
  }

  function addSlide() {
    setSlides((list) => [
      ...list,
      { id: crypto.randomUUID(), title: "", text: "", image: null },
    ]);
  }

  function save() {
    const parsed = heroSchema.safeParse({ slides });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    startSaving(async () => {
      const result = await saveHeroSection(parsed.data, visible);
      if (result.ok) {
        setSaved({ slides, visible });
        setCustomized(true);
        toast.success("Hero saved. The website is updated.");
      } else {
        toast.error(result.error);
      }
    });
  }

  function reset() {
    startSaving(async () => {
      const result = await resetHeroSection();
      if (result.ok) {
        setSlides(heroDefault.slides);
        setVisible(true);
        setSaved({ slides: heroDefault.slides, visible: true });
        setCustomized(false);
        setResetOpen(false);
        toast.success("Original hero restored on the website.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {slides.map((slide, i) => (
        <Card key={slide.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">
              Slide {i + 1}
              <span className="font-normal text-muted-foreground">
                {" "}
                of {slides.length}
              </span>
            </CardTitle>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Move slide ${i + 1} up`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Move slide ${i + 1} down`}
                disabled={i === slides.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDownIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete slide ${i + 1}`}
                disabled={slides.length === 1}
                onClick={() =>
                  setSlides((list) => list.filter((s) => s.id !== slide.id))
                }
              >
                <Trash2Icon />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-[18rem_1fr]">
            {/* Photo */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {slide.image ? (
                  <Image
                    src={slide.image.url}
                    alt={slide.image.alt}
                    fill
                    sizes="288px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
                    <ImageIcon className="size-6" aria-hidden />
                    No photo (placeholder shown)
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPickerFor(slide.id)}
                >
                  {slide.image ? "Change photo" : "Choose photo"}
                </Button>
                {slide.image ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => update(slide.id, { image: null })}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              {slide.image ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`alt-${slide.id}`} className="text-xs">
                    Photo description
                  </Label>
                  <Input
                    id={`alt-${slide.id}`}
                    value={slide.image.alt}
                    maxLength={300}
                    onChange={(e) =>
                      update(slide.id, {
                        image: { ...slide.image!, alt: e.target.value },
                      })
                    }
                  />
                </div>
              ) : null}
            </div>

            {/* Texts */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <Label htmlFor={`title-${slide.id}`}>Title</Label>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {slide.title.length}/120
                  </span>
                </div>
                <Input
                  id={`title-${slide.id}`}
                  value={slide.title}
                  maxLength={120}
                  placeholder="e.g. Plus de quatre décennies d'expertise"
                  onChange={(e) => update(slide.id, { title: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <Label htmlFor={`text-${slide.id}`}>Text</Label>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {slide.text.length}/600
                  </span>
                </div>
                <Textarea
                  id={`text-${slide.id}`}
                  value={slide.text}
                  maxLength={600}
                  rows={5}
                  onChange={(e) => update(slide.id, { text: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={slides.length >= HERO_MAX_SLIDES}
        onClick={addSlide}
      >
        <PlusIcon data-icon="inline-start" />
        Add a slide
        {slides.length >= HERO_MAX_SLIDES ? ` (${HERO_MAX_SLIDES} max)` : ""}
      </Button>

      {/* Save bar */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="hero-visible"
            checked={visible}
            onCheckedChange={(v) => setVisible(v === true)}
          />
          <Label htmlFor="hero-visible">Show this section on the website</Label>
        </div>
        <div className="flex items-center gap-2">
          {dirty ? (
            <span className="text-xs text-muted-foreground">
              Unsaved changes
            </span>
          ) : null}
          {customized ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={saving}
              onClick={() => setResetOpen(true)}
            >
              Restore original
            </Button>
          ) : null}
          <Link
            href="/"
            target="_blank"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View website
            <ExternalLinkIcon data-icon="inline-end" />
          </Link>
          <Button
            type="button"
            variant="outline"
            disabled={!dirty || saving}
            onClick={() => {
              setSlides(saved.slides);
              setVisible(saved.visible);
            }}
          >
            Discard
          </Button>
          <Button type="button" disabled={!dirty || saving} onClick={save}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore the original hero?</AlertDialogTitle>
            <AlertDialogDescription>
              Your saved slides will be replaced by the original texts and
              photos of the website. Photos stay in the media library. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={reset}
              disabled={saving}
            >
              {saving ? "Restoring…" : "Restore original"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MediaPickerDialog
        open={pickerFor !== null}
        onOpenChange={(open) => !open && setPickerFor(null)}
        items={library}
        onItemsChange={setLibrary}
        canUpload={canUpload}
        onSelect={(item) => {
          if (!pickerFor) return;
          update(pickerFor, {
            image: { url: item.url, alt: item.altText ?? "", mediaId: item.id },
          });
        }}
      />
    </div>
  );
}
