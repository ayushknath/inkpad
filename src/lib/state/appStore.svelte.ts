import { storageService } from "$lib/service/storageService";
import type { editorStatesType } from "$lib/types/editorStatesType";
import type { Note, saveStatusType } from "$lib/types/types";
import { tiptapTextMatch } from "$lib/utils/tiptapTextMatch";

interface AppState {
  notes: Note[];
  noteSearch: { query: string };
  noteSave: saveStatusType;
  editor: editorStatesType;
  sidebar: { isSidebarClosed: boolean };
}

function createAppStore() {
  let state: AppState = $state({
    notes: storageService.readNotes(),
    noteSearch: { query: "" },
    noteSave: { status: null },
    editor: {
      editorTitle: "",
      bodyField: undefined,
      editorState: { editor: null },
      activeNote: null,
      tick: 0,
    },
    sidebar: { isSidebarClosed: false },
  });

  let displayNotes = $derived.by(() => {
    const q = state.noteSearch.query.trim().toLowerCase();

    if (!q) return state.notes;

    return state.notes.filter((note) => {
      let titleMatch = note.title.toLowerCase().includes(q);
      let bodyMatch = tiptapTextMatch(note.body, q);

      return titleMatch || bodyMatch;
    });
  });

  return {
    get state() {
      return state;
    },

    get displayNotes() {
      return displayNotes;
    },
  };
}

const appStore = createAppStore();

export { appStore };
