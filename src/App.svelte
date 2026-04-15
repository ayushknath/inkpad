<script lang="ts">
  import type { Note, saveStatusType } from "$lib/types/types";
  import type { noteStatesType } from "$lib/types/noteStatesType";
  import type { editorStatesType } from "$lib/types/editorStatesType";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import { Placeholder } from "@tiptap/extensions";
  import Sidebar from "./components/Sidebar/Sidebar.svelte";
  import NoteEditor from "./components/Editor/NoteEditor.svelte";
  import { setNoteContext, createNoteContext } from "$lib/contexts/noteContext";
  import { setEditorContext } from "$lib/contexts/editorContext";
  import { setSidebarContext } from "$lib/contexts/sidebarContext";
  import { setEditorMethodsContext } from "$lib/contexts/editorMethodsContext";
  import { setSaveStatusContext } from "$lib/contexts/saveStatusContext";
  import { setDebounceSaveContext } from "$lib/contexts/debounceSaveContext";

  // Note states and context setting
  const noteStates: noteStatesType = $state({
    notes: [],
    query: "",
  });

  let storedNotes = localStorage.getItem("inkpadNotes");

  if (storedNotes) noteStates.notes = JSON.parse(storedNotes);

  const displayNotes = $derived.by(() => {
    const q = noteStates.query.trim().toLowerCase();

    if (!q) return noteStates.notes;

    return noteStates.notes.filter((note) => {
      let titleMatch = note.title.toLowerCase().includes(q);
      let bodyMatch: boolean = false;

      for (let p of note.body.content) {
        if (!p.content) continue;

        for (let n of p.content) {
          bodyMatch = n.text.toLowerCase().includes(q);
          if (bodyMatch) break;
        }

        if (bodyMatch) break;
      }

      return titleMatch || bodyMatch;
    });
  });

  setNoteContext(createNoteContext(noteStates, () => displayNotes));

  // Editor states and context setting
  const editorStates: editorStatesType = $state({
    editorTitle: "",
    bodyField: undefined,
    editorState: { editor: null },
    activeNote: null,
    tick: 0,
  });

  setEditorContext(editorStates);

  // Sidebar state and context setting
  const sidebarState: { isSidebarClosed: boolean } = $state({
    isSidebarClosed: false,
  });

  setSidebarContext(sidebarState);

  // Note save status and context setting
  const saveStatus: saveStatusType = $state({
    status: null,
  });

  setSaveStatusContext(saveStatus);

  // Debounce timer and context setting
  let saveTimerId: number | null = null;

  function clearDebounceSaveTimer(): void {
    if (saveTimerId) clearTimeout(saveTimerId);
  }

  function startDebounceSaveTimer(): void {
    saveTimerId = setTimeout(() => {
      saveNote();
    }, 500);
  }

  setDebounceSaveContext({ clearDebounceSaveTimer, startDebounceSaveTimer });

  // Editor methods and context setting
  function saveNote(): void {
    saveStatus.status = "saving";

    if (editorStates.activeNote) {
      const idx = noteStates.notes.findIndex(
        (note) => editorStates.activeNote === note.id,
      );

      if (idx === -1) return;

      const note = noteStates.notes[idx];

      const title = note.title;
      const body = note.body;

      const hasTitleChanged = editorStates.editorTitle !== title;
      const hasBodyChanged =
        JSON.stringify(editorStates.editorState.editor?.getJSON()) !==
        JSON.stringify(body);

      if (hasTitleChanged) {
        note.lastChange.title = title;
        note.title = editorStates.editorTitle;
      }

      if (hasBodyChanged) {
        note.lastChange.body = body;
        note.body = editorStates.editorState.editor?.getJSON();
      }

      if (hasTitleChanged || hasBodyChanged) {
        note.time.modifiedAt = new Date();
        noteStates.notes.splice(idx, 1, note);
      }
    } else {
      const id = uuidv4();
      editorStates.activeNote = id;
      const note: Note = {
        id,
        title: editorStates.editorTitle,
        body: editorStates.editorState.editor?.getJSON(),
        lastChange: {
          title: "",
          body: "",
        },
        time: {
          createdAt: new Date(),
          modifiedAt: null,
        },
      };
      noteStates.notes = [note, ...noteStates.notes];
    }

    localStorage.setItem("inkpadNotes", JSON.stringify(noteStates.notes));

    saveStatus.status = "saved";
  }

  function editNote(id: string): void {
    if (editorStates.activeNote) saveNote();
    clearEditor();

    editorStates.activeNote = id;

    const [note] = noteStates.notes.filter((note) => id === note.id);
    editorStates.editorTitle = note.title;
    editorStates.editorState.editor?.commands.setContent(note.body);
  }

  function deleteNote(id: string): void {
    if (editorStates.activeNote && editorStates.activeNote === id) {
      clearEditor();
      editorStates.activeNote = null;
    }
    noteStates.notes = noteStates.notes.filter((note) => id !== note.id);
    localStorage.setItem("inkpadNotes", JSON.stringify(noteStates.notes));
  }

  function clearEditor(): void {
    editorStates.editorTitle = "";
    editorStates.editorState.editor?.commands.clearContent(false);
  }

  setEditorMethodsContext({ saveNote, editNote, deleteNote, clearEditor });

  onMount(() => {
    editorStates.editorState.editor = new Editor({
      element: editorStates.bodyField,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Body goes here...",
        }),
      ],
      onTransaction({ editor }) {
        editorStates.editorState = { editor };
      },
      onUpdate({ editor }) {
        clearDebounceSaveTimer();
        startDebounceSaveTimer();
      },
    });
  });
</script>

<div
  class="grid {sidebarState.isSidebarClosed
    ? 'grid-cols-[80px_1fr]'
    : 'grid-cols-[20rem_1fr]'} max-w-384 h-screen mx-auto overflow-hidden 2xl:border-x"
>
  <Sidebar />

  <NoteEditor />
</div>

<style>
  :global(.tiptap) {
    outline: 0;
  }

  :global(.tiptap p.is-editor-empty:first-child::before) {
    color: #848484;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  :global(.tiptap pre) {
    padding: 0.5rem;
    color: #fff;
    border-radius: 0.5rem;
    background-color: #2e2b29;
  }

  :global(.tiptap ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  :global(.tiptap ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }

  :global(.tiptap h1) {
    font-size: 2rem;
    font-weight: bold;
  }

  :global(.tiptap h2) {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
