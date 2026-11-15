"use client";

import {
  CardList,
  EditorCard,
  ImageField,
  SaveBar,
  TextAreaField,
  TextField,
  TextList,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

/** Home page "Notre Vision": the scroll steps (title, text, bullet list, photo). */
export function VisionEditor(props: SectionEditorProps<"home_vision">) {
  const editor = useSectionEditor("home_vision", props);
  const c = editor.content;

  return (
    <div className="flex flex-col gap-4">
      <EditorCard title="Heading">
        <TextField
          label="Small label (badge)"
          value={c.eyebrow}
          max={80}
          onChange={(eyebrow) => editor.update({ eyebrow })}
        />
      </EditorCard>

      <CardList
        items={c.steps}
        onChange={(steps) => editor.update({ steps })}
        itemName="Step"
        min={1}
        max={8}
        create={() => ({ heading: "", text: "", list: [], image: null })}
      >
        {(step, update) => (
          <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
            <ImageField
              value={step.image}
              onChange={(image) => update({ image })}
            />
            <div className="flex flex-col gap-4">
              <TextField
                label="Title"
                value={step.heading}
                max={120}
                onChange={(heading) => update({ heading })}
              />
              <TextAreaField
                label="Text"
                value={step.text}
                max={1500}
                rows={4}
                onChange={(text) => update({ text })}
              />
              <TextList
                label="Bullet list (optional)"
                itemName="Item"
                items={step.list}
                max={10}
                itemMax={400}
                onChange={(list) => update({ list })}
              />
            </div>
          </div>
        )}
      </CardList>

      <SaveBar editor={editor} previewHref="/#vision" />
    </div>
  );
}
