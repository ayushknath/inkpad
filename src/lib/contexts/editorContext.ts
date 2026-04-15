import { createContext } from "svelte";
import type { editorStatesType } from "$lib/types/editorStatesType";

export const [getEditorContext, setEditorContext] =
  createContext<editorStatesType>();
