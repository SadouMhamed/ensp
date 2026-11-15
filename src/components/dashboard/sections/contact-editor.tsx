"use client";

import { useId } from "react";
import {
  LOCATION_KINDS,
  LOCATION_KIND_LABELS,
} from "@/lib/validations/sections";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardList,
  EditorCard,
  SaveBar,
  TextField,
  useSectionEditor,
  type SectionEditorProps,
} from "./editor-kit";

const kindItems = LOCATION_KINDS.map((k) => ({
  value: k,
  label: LOCATION_KIND_LABELS[k],
}));

/** Contact details: head office, department e-mails and locations (contact page + footer). */
export function ContactEditor(props: SectionEditorProps<"contact">) {
  const editor = useSectionEditor("contact", props);
  const c = editor.content;
  const kindId = useId();

  return (
    <div className="flex flex-col gap-4">
      <EditorCard
        title="Head office"
        description="Shown on the contact page and in the footer of every page."
      >
        <TextField
          label="Address"
          value={c.address}
          max={300}
          onChange={(address) => editor.update({ address })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Phone"
            type="tel"
            value={c.phone}
            max={80}
            onChange={(phone) => editor.update({ phone })}
          />
          <TextField
            label="Fax (optional)"
            type="tel"
            value={c.fax}
            max={80}
            onChange={(fax) => editor.update({ fax })}
          />
          <TextField
            label="E-mail"
            type="email"
            value={c.email}
            max={200}
            onChange={(email) => editor.update({ email })}
          />
          <TextField
            label="Opening hours (optional)"
            value={c.hours}
            max={120}
            onChange={(hours) => editor.update({ hours })}
          />
        </div>
        <TextField
          label="Google Maps link (optional)"
          type="url"
          value={c.mapUrl}
          max={500}
          placeholder="https://www.google.com/maps?q=…"
          onChange={(mapUrl) => editor.update({ mapUrl })}
        />
      </EditorCard>

      <h3 className="mt-2 font-medium">Contacts by department</h3>
      <CardList
        items={c.departments}
        onChange={(departments) => editor.update({ departments })}
        itemName="Department"
        max={12}
        create={() => ({ title: "", email: "" })}
      >
        {(d, update) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Department"
              value={d.title}
              max={120}
              onChange={(title) => update({ title })}
            />
            <TextField
              label="E-mail"
              type="email"
              value={d.email}
              max={200}
              onChange={(email) => update({ email })}
            />
          </div>
        )}
      </CardList>

      <h3 className="mt-2 font-medium">Locations</h3>
      <CardList
        items={c.locations}
        onChange={(locations) => editor.update({ locations })}
        itemName="Location"
        max={30}
        create={() => ({
          title: "",
          kind: "region" as const,
          address: "",
          phone: "",
          fax: "",
        })}
      >
        {(l, update, i) => (
          <>
            <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
              <TextField
                label="Name"
                value={l.title}
                max={160}
                onChange={(title) => update({ title })}
              />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${kindId}-${i}`}>Type</Label>
                <Select
                  items={kindItems}
                  value={l.kind}
                  onValueChange={(kind) => {
                    if (kind) update({ kind });
                  }}
                >
                  <SelectTrigger id={`${kindId}-${i}`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kindItems.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TextField
              label="Address"
              value={l.address}
              max={300}
              onChange={(address) => update({ address })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Phone (optional)"
                type="tel"
                value={l.phone}
                max={120}
                onChange={(phone) => update({ phone })}
              />
              <TextField
                label="Fax (optional)"
                type="tel"
                value={l.fax}
                max={120}
                onChange={(fax) => update({ fax })}
              />
            </div>
          </>
        )}
      </CardList>

      <SaveBar editor={editor} previewHref="/contact" />
    </div>
  );
}
