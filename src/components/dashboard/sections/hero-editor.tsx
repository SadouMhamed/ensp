"use client";

import { HERO_MAX_SLIDES } from "@/lib/validations/sections";
import {
  CardList,
  ImageField,
  SaveBar,
  TextAreaField,
  TextField,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

/** Home page hero: slides (photo, title, text), order, visibility. */
export function HeroEditor(props: SectionEditorProps<"home_hero">) {
  const editor = useSectionEditor("home_hero", props);
  const { slides } = editor.content;

  return (
    <div className="flex flex-col gap-4">
      <CardList
        items={slides}
        onChange={(next) => editor.update({ slides: next })}
        itemName="Slide"
        min={1}
        max={HERO_MAX_SLIDES}
        create={() => ({ title: "", text: "", image: null })}
      >
        {(slide, update) => (
          <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
            <ImageField
              value={slide.image}
              onChange={(image) => update({ image })}
            />
            <div className="flex flex-col gap-4">
              <TextField
                label="Title"
                value={slide.title}
                max={120}
                placeholder="e.g. Plus de quatre décennies d'expertise"
                onChange={(title) => update({ title })}
              />
              <TextAreaField
                label="Text"
                value={slide.text}
                max={600}
                rows={5}
                onChange={(text) => update({ text })}
              />
            </div>
          </div>
        )}
      </CardList>
      <SaveBar editor={editor} />
    </div>
  );
}
