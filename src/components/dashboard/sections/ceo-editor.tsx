"use client";

import {
  EditorCard,
  ImageField,
  SaveBar,
  TextField,
  TextList,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

/** Home page "Mot du PDG": heading, portrait, greeting, message, name and role. */
export function CeoEditor(props: SectionEditorProps<"home_ceo">) {
  const editor = useSectionEditor("home_ceo", props);
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
          max={160}
          onChange={(title) => editor.update({ title })}
        />
      </EditorCard>

      <EditorCard title="Portrait and signature">
        <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
          <ImageField
            label="Portrait"
            value={c.photo}
            aspect="aspect-[3/4]"
            onChange={(photo) => editor.update({ photo })}
          />
          <div className="flex flex-col gap-4">
            <TextField
              label="Name"
              value={c.name}
              max={120}
              onChange={(name) => editor.update({ name })}
            />
            <TextField
              label="Role"
              value={c.role}
              max={120}
              onChange={(role) => editor.update({ role })}
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard
        title="Message"
        description="The first 2 paragraphs are always shown; the others appear with “Lire le message complet”."
      >
        <TextField
          label="Greeting"
          value={c.salutation}
          max={200}
          onChange={(salutation) => editor.update({ salutation })}
        />
        <TextList
          label="Paragraphs"
          itemName="Paragraph"
          items={c.message}
          min={1}
          max={25}
          itemMax={2500}
          onChange={(message) => editor.update({ message })}
        />
      </EditorCard>

      <SaveBar editor={editor} previewHref="/#mot-du-pdg" />
    </div>
  );
}
