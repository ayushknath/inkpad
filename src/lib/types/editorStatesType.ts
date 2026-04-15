import { Editor } from "@tiptap/core";

export interface editorStatesType {
  editorTitle: string;
  bodyField: HTMLElement | undefined;
  editorState: { editor: Editor | null };
  activeNote: string | null;
  tick: number;
}
