import { createContext } from "svelte";
import type { debounceSaveTypes } from "$lib/types/debounceSaveTypes";

export const [getDebounceSaveContext, setDebounceSaveContext] =
  createContext<debounceSaveTypes>();
