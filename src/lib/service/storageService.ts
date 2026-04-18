import type { Note } from "$lib/types/types";

const key = "inkpadNotes";

const storageService = {
  readNotes() {
    const notes = localStorage.getItem(key);
    return notes ? JSON.parse(notes) : [];
  },

  writeNotes(notes: Note[]) {
    localStorage.setItem(key, JSON.stringify(notes));
  },
};

export { storageService };
