import { appStore } from "$lib/state/appStore.svelte";
import type { Note } from "$lib/types/types";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "$lib/service/storageService";

const noteService = {
  createNote(): string {
    const id = uuidv4();
    const newNote: Note = {
      id,
      title: appStore.state.editor.editorTitle,
      body: appStore.state.editor.editorState.editor?.getJSON(),
      lastChange: { title: "", body: "" },
      time: { createdAt: new Date(), modifiedAt: null },
    };

    appStore.state.notes = [newNote, ...appStore.state.notes];
    storageService.writeNotes(appStore.state.notes);

    return id;
  },

  updateNote(id: string) {
    const idx = appStore.state.notes.findIndex((note) => id === note.id);
    if (idx === -1) return;

    const note = appStore.state.notes[idx];

    const title = note.title;
    const body = note.body;

    const hasTitleChanged = appStore.state.editor.editorTitle !== title;
    const hasBodyChanged =
      JSON.stringify(appStore.state.editor.editorState.editor?.getJSON()) !==
      JSON.stringify(body);

    if (hasTitleChanged) {
      note.lastChange.title = title;
      note.title = appStore.state.editor.editorTitle;
    }

    if (hasBodyChanged) {
      note.lastChange.body = body;
      note.body = appStore.state.editor.editorState.editor?.getJSON();
    }

    if (hasTitleChanged || hasBodyChanged) {
      note.time.modifiedAt = new Date();
      appStore.state.notes.splice(idx, 1, note);
      storageService.writeNotes(appStore.state.notes);
    }
  },

  saveNote() {
    const activeNote = appStore.state.editor.activeNote;

    appStore.state.noteSave.status = "saving";

    if (activeNote) {
      this.updateNote(activeNote);
    } else {
      const id = this.createNote();
      appStore.state.editor.activeNote = id;
    }

    appStore.state.noteSave.status = "saved";
  },

  editNote(id: string) {
    if (appStore.state.editor.activeNote) this.saveNote();
    appStore.state.editor.activeNote = id;

    const note = appStore.state.notes.find((note) => id === note.id);
    if (!note) return;

    appStore.state.editor.editorTitle = note.title;
    appStore.state.editor.editorState.editor?.commands.setContent(note.body, {
      emitUpdate: false,
    });
  },

  deleteNote(id: string) {
    const activeNote = appStore.state.editor.activeNote;

    if (activeNote && id === activeNote) {
      this.clearEditor();
      appStore.state.editor.activeNote = null;
    }

    appStore.state.notes = appStore.state.notes.filter(
      (note) => id !== note.id,
    );
    storageService.writeNotes(appStore.state.notes);
  },

  clearEditor() {
    appStore.state.editor.editorTitle = "";
    appStore.state.editor.editorState.editor?.commands.clearContent(false);
  },
};

export { noteService };
