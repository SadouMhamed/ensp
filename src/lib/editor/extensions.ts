import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import type { Extensions } from "@tiptap/core";

/**
 * Tiptap extensions shared by the dashboard editor (client) and the public article
 * renderer (server), so what editors write is exactly what visitors see.
 * StarterKit v3 includes bold, italic, underline, strike, link, headings, lists,
 * blockquote, code, code block, horizontal rule and undo/redo.
 */
export const articleExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] }, // H1 is the article title
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: { rel: "noopener noreferrer nofollow", target: null },
    },
  }),
  Image.configure({ HTMLAttributes: { loading: "lazy" } }),
];
