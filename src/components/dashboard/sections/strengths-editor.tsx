"use client";

import {
  CardList,
  EditorCard,
  ImageField,
  SaveBar,
  TextAreaField,
  TextField,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

/** Home page "Nos atouts clés": heading, photo and the strengths shown on the timeline. */
export function StrengthsEditor(props: SectionEditorProps<"home_strengths">) {
  const editor = useSectionEditor("home_strengths", props);
  const c = editor.content;

  return (
    <div className="flex flex-col gap-4">
      <EditorCard title="Heading and photo">
        <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
          <ImageField
            value={c.image}
            aspect="aspect-square"
            emptyHint="No photo (the timeline starts with the title)"
            onChange={(image) => editor.update({ image })}
          />
          <div className="flex flex-col gap-4">
            <TextField
              label="Small label (badge)"
              value={c.eyebrow}
              max={80}
              onChange={(eyebrow) => editor.update({ eyebrow })}
            />
            <TextField
              label="Section title"
              value={c.title}
              max={120}
              onChange={(title) => editor.update({ title })}
            />
            <TextField
              label="Label under the title"
              value={c.periodLabel}
              max={60}
              placeholder="e.g. Depuis 1981"
              onChange={(periodLabel) => editor.update({ periodLabel })}
            />
          </div>
        </div>
      </EditorCard>

      <CardList
        items={c.items}
        onChange={(items) => editor.update({ items })}
        itemName="Strength"
        min={1}
        max={10}
        create={() => ({ title: "", text: "" })}
      >
        {(item, update) => (
          <>
            <TextField
              label="Title"
              value={item.title}
              max={120}
              onChange={(title) => update({ title })}
            />
            <TextAreaField
              label="Text"
              value={item.text}
              max={400}
              rows={3}
              onChange={(text) => update({ text })}
            />
          </>
        )}
      </CardList>

      <SaveBar editor={editor} previewHref="/#atouts" />
    </div>
  );
}
