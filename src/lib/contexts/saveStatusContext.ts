import { createContext } from "svelte";
import type { saveStatusType } from "$lib/types/types";

export const [getSaveStatusContext, setSaveStatusContext] =
  createContext<saveStatusType>();
