import { createContext } from "svelte";
import type { editorMethodsType } from "$lib/types/editorMethodsType";

export const [getEditorMethodsContext, setEditorMethodsContext] =
  createContext<editorMethodsType>();
