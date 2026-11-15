"use client";

import {
  EditorCard,
  ImageField,
  SaveBar,
  TextAreaField,
  TextField,
  TextList,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

/** Home page "Présentation": heading, paragraphs, photo and the "Notre mission" card. */
export function PresentationEditor(
  props: SectionEditorProps<"home_presentation">,
) {
  const editor = useSectionEditor("home_presentation", props);
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
        <TextField
          label="Section title"
          value={c.title}
          max={200}
          onChange={(title) => editor.update({ title })}
        />
      </EditorCard>

      <EditorCard
        title="Text"
        description="Each paragraph is shown with a check mark."
      >
        <TextList
          label="Paragraphs"
          itemName="Paragraph"
          items={c.paragraphs}
          min={1}
          max={8}
          itemMax={1500}
          onChange={(paragraphs) => editor.update({ paragraphs })}
        />
      </EditorCard>

      <EditorCard title="Photo and mission">
        <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
          <ImageField
            value={c.image}
            onChange={(image) => editor.update({ image })}
          />
          <div className="flex flex-col gap-4">
            <TextField
              label="Mission title"
              value={c.missionTitle}
              max={80}
              onChange={(missionTitle) => editor.update({ missionTitle })}
            />
            <TextField
              label="Mission subtitle"
              value={c.missionSubtitle}
              max={160}
              onChange={(missionSubtitle) => editor.update({ missionSubtitle })}
            />
            <TextAreaField
              label="Mission text"
              value={c.missionText}
              max={2000}
              rows={6}
              onChange={(missionText) => editor.update({ missionText })}
            />
          </div>
        </div>
      </EditorCard>

      <SaveBar editor={editor} previewHref="/#presentation" />
    </div>
  );
}
