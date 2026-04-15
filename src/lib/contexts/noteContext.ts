import { createContext } from "svelte";
import type { noteStatesType } from "$lib/types/noteStatesType";
import type { Note } from "$lib/types/types";

export function createNoteContext(
  noteStates: noteStatesType,
  getDisplayNotes: () => Note[],
) {
  return {
    get notes() {
      return noteStates.notes;
    },

    get query() {
      return noteStates.query;
    },

    get displayNotes() {
      return getDisplayNotes();
    },
  };
}

export const [getNoteContext, setNoteContext] =
  createContext<ReturnType<typeof createNoteContext>>();
