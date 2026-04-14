<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import {
    Bold,
    Cloud,
    CloudAlert,
    CloudCheck,
    CloudUpload,
    Code,
    Ellipsis,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    PanelRight,
    Pencil,
    Plus,
    Search,
    Strikethrough,
    Trash,
    Underline,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import { Placeholder } from "@tiptap/extensions";

  interface Note {
    id: string;
    title: string;
    body: any; // TODO: deal later with the type
    lastChange: {
      title: string;
      body: any; // TODO: deal with type later
    };
    time: {
      createdAt: Date;
      modifiedAt: Date | null;
    };
  }

  type saveStatusType = "saving" | "saved" | "error" | null;

  let storedNotes = localStorage.getItem("inkpadNotes");

  let notes: Note[] = $state(storedNotes ? JSON.parse(storedNotes) : []);
  let query = $state("");
  let displayNotes: Note[] = $derived.by(() => {
    const q = query.trim().toLowerCase();

    if (!q) return notes;

    return notes.filter((note) => {
      let bodyHasQ = false;

      for (let i = 0; i < note.body.content.length; i++) {
        const p = note.body.content[i];

        if (!p.content) continue;

        for (let j = 0; j < p.content.length; j++) {
          const n = p.content[j];
          bodyHasQ = n.text.toLowerCase().includes(q);
          if (bodyHasQ) break;
        }

        if (bodyHasQ) break;
      }

      return note.title.toLowerCase().includes(q) || bodyHasQ;
    });
  });

  let isSidebarClosed: boolean = $state(false);

  let saveStatus: saveStatusType = $state(null);

  let editorTitle = $state("");
  let bodyField: HTMLElement | undefined = $state();
  let editorState: { editor: Editor | null } = $state({ editor: null });

  let activeNote: string | null = $state(null);

  let saveTimerId: number | null = null;

  onMount(() => {
    editorState.editor = new Editor({
      element: bodyField,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Body goes here...",
        }),
      ],
      onTransaction: ({ editor }) => {
        editorState = { editor };
      },
      onUpdate({ editor }) {
        if (saveTimerId) clearTimeout(saveTimerId);
        saveTimerId = setTimeout(() => {
          saveNote();
        }, 500);
      },
    });
  });

  function saveNote(): void {
    saveStatus = "saving";

    if (activeNote) {
      const idx = notes.findIndex((note) => activeNote === note.id);

      if (idx === -1) return;

      const note = notes[idx];

      const title = note.title;
      const body = note.body;

      const hasTitleChanged = editorTitle !== title;
      const hasBodyChanged =
        JSON.stringify(editorState.editor?.getJSON()) !== JSON.stringify(body);

      if (hasTitleChanged) {
        note.lastChange.title = title;
        note.title = editorTitle;
      }

      if (hasBodyChanged) {
        note.lastChange.body = body;
        note.body = editorState.editor?.getJSON();
      }

      if (hasTitleChanged || hasBodyChanged) {
        note.time.modifiedAt = new Date();
        notes.splice(idx, 1, note);
      }
    } else {
      const id = uuidv4();
      activeNote = id;
      const note: Note = {
        id,
        title: editorTitle,
        body: editorState.editor?.getJSON(),
        lastChange: {
          title: "",
          body: "",
        },
        time: {
          createdAt: new Date(),
          modifiedAt: null,
        },
      };
      notes = [note, ...notes];
    }

    localStorage.setItem("inkpadNotes", JSON.stringify(notes));

    saveStatus = "saved";
  }

  function editNote(id: string): void {
    if (activeNote) saveNote();
    clearEditor();

    activeNote = id;

    const [note] = notes.filter((note) => id === note.id);
    editorTitle = note.title;
    editorState.editor?.commands.setContent(note.body);
  }

  function deleteNote(id: string): void {
    if (activeNote && activeNote === id) {
      clearEditor();
      activeNote = null;
    }
    notes = notes.filter((note) => id !== note.id);
    localStorage.setItem("inkpadNotes", JSON.stringify(notes));
  }

  function clearEditor(): void {
    editorTitle = "";
    editorState.editor?.commands.clearContent(false);
  }

  function getTimeString(date: Date | string): string {
    date = new Date(date);

    const rtf = new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
      style: "short",
    });

    const DIVISIONS = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.345, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];
    const LEN_DIVISIONS = DIVISIONS.length;

    let duration = (date.getTime() - new Date().getTime()) / 1000;
    let timeString = "";

    for (let i = 0; i < LEN_DIVISIONS; i++) {
      const d = DIVISIONS[i];
      if (Math.abs(duration) < d.amount) {
        timeString = rtf.format(
          Math.round(duration),
          d.name as Intl.RelativeTimeFormatUnit,
        );
        break;
      }
      duration /= d.amount;
    }

    return timeString;
  }
</script>

<div
  class="grid {isSidebarClosed
    ? 'grid-cols-[80px_1fr]'
    : 'grid-cols-[20rem_1fr]'} max-w-384 h-screen mx-auto overflow-hidden 2xl:border-x"
>
  <section class="sidebar relative h-full border-r p-4">
    <header
      class="flex items-center {isSidebarClosed
        ? 'justify-center'
        : 'justify-between'} mb-6"
    >
      <div class="logo {isSidebarClosed ? 'hidden' : ''}">
        <span class="font-bold">INKPAD</span>
      </div>
      <div
        class="flex {isSidebarClosed
          ? 'flex-col-reverse justify-center'
          : 'items-center'} gap-2"
      >
        <Button
          class="new-note-btn"
          size="icon-sm"
          variant="outline"
          title="New note"
          onclick={() => {
            if (activeNote) saveNote();
            activeNote = null;
            clearEditor();
          }}
        >
          <Plus />
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          class="toggle"
          title="Toggle sidebar"
          onclick={() => (isSidebarClosed = !isSidebarClosed)}
        >
          <PanelRight />
        </Button>
      </div>
    </header>

    <div class="mb-4 {isSidebarClosed ? 'hidden' : ''}">
      <h1 class="font-bold text-2xl mb-2.5">Your notes</h1>
      <div class="relative">
        <div class="absolute top-2 left-2">
          <Search size={20} color="#73737C" />
        </div>
        <Input
          class="pl-8.5"
          type="search"
          bind:value={query}
          placeholder="Search your notes"
        />
      </div>
    </div>

    <div class="notes-list {isSidebarClosed ? 'hidden' : ''}">
      <ul class="flex flex-col gap-4 h-125 overflow-auto">
        {#each displayNotes as note (note.id)}
          <li class="border rounded-md p-2">
            <header class="flex items-center justify-between mb-2">
              <span>
                <small class="text-gray-500">
                  {note.time.modifiedAt
                    ? `Modified: ${getTimeString(note.time.modifiedAt)}`
                    : `Created: ${getTimeString(note.time.createdAt)}`}
                </small>
              </span>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button size="icon-sm" variant="outline" title="More options">
                    <Ellipsis />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-auto">
                  <DropdownMenu.Group>
                    <DropdownMenu.Item onSelect={() => editNote(note.id)}>
                      <Pencil /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => deleteNote(note.id)}>
                      <Trash /> Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </header>

            <h2
              class="note-title whitespace-nowrap overflow-hidden text-ellipsis font-bold mb-1"
            >
              {note.title}
            </h2>
            <p class="note-body text-sm">
              {#each note.body.content[0].content as c}
                <span>{c.text}</span>
              {/each}
            </p>
          </li>
        {/each}
      </ul>
    </div>

    <div
      class="user absolute bottom-0 left-0 w-full {isSidebarClosed
        ? 'py-4 px-2'
        : 'p-4'} bg-gray-300"
    >
      <p class={isSidebarClosed ? "text-sm" : ""}>Work in progress</p>
    </div>
  </section>

  <section class="editor py-4 px-8">
    <header class="flex items-center justify-between mb-12">
      <div class="toolbar">
        <ul class="flex items-center gap-2">
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("bold")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleBold().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleBold()
                .run()}
            >
              <Bold />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("italic")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleItalic().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()}
            >
              <Italic />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("underline")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleUnderline().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleUnderline()
                .run()}
            >
              <Underline />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("strike")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleStrike().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()}
            >
              <Strikethrough />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("bulletList")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleBulletList().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleBulletList()
                .run()}
            >
              <List />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("orderedList")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleOrderedList()
                .run()}
            >
              <ListOrdered />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("heading", { level: 1 })
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: 1 })
                  .run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run()}
            >
              <Heading1 />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("heading", { level: 2 })
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: 2 })
                  .run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()}
            >
              <Heading2 />
            </Button>
          </li>
          <li>
            <Button
              size="icon"
              variant="outline"
              class={editorState.editor?.isActive("codeBlock")
                ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
                : ""}
              onclick={() =>
                editorState.editor?.chain().focus().toggleCodeBlock().run()}
              disabled={!editorState.editor
                ?.can()
                .chain()
                .focus()
                .toggleCodeBlock()
                .run()}
            >
              <Code />
            </Button>
          </li>
        </ul>
      </div>
      <div class="note-save-status">
        {#if activeNote}
          <div title={saveStatus ? saveStatus : ""}>
            {#if saveStatus === "saving"}
              <CloudUpload size={20} />
            {:else if saveStatus === "saved"}
              <CloudCheck size={20} />
            {:else if saveStatus === "error"}
              <CloudAlert size={20} />
            {:else}
              <Cloud size={20} />
            {/if}
          </div>
        {/if}
      </div>
    </header>

    <div class="editor-fields">
      <div class="title-field mb-12">
        <input
          class="text-xl w-full"
          id="editor-title-input"
          type="text"
          bind:value={editorTitle}
          oninput={() => {
            if (saveTimerId) clearTimeout(saveTimerId);
            saveTimerId = setTimeout(() => {
              saveNote();
            }, 500);
          }}
          placeholder="Title goes here..."
        />
      </div>
      <div class="body-field" bind:this={bodyField}></div>
    </div>
  </section>
</div>

<style>
  .note-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  #editor-title-input {
    border: 0;
    outline: 0;
  }

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
