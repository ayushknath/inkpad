<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Italic,
    Link,
    List,
    ListOrdered,
    PanelRight,
    Search,
    Strikethrough,
    Underline,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import { Placeholder } from "@tiptap/extensions";

  interface Note {
    id: string;
    title: string;
    body: string;
    time: {
      createdAt: Date;
      modifiedAt: Date | null;
    };
  }

  const notes: Note[] = $state([
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A eligendi iste qui, sequi atque aspernatur necessitatibus, tenetur itaque earum maxime officia quaerat accusantium, enim repudiandae iusto voluptate? Facilis, distinctio quam.",
      time: { createdAt: new Date(), modifiedAt: null },
    },
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A eligendi iste qui, sequi atque aspernatur necessitatibus, tenetur itaque earum maxime officia quaerat accusantium, enim repudiandae iusto voluptate? Facilis, distinctio quam.",
      time: { createdAt: new Date(), modifiedAt: new Date("10 April 2026") },
    },
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Hello World",
      time: { createdAt: new Date("13 April 2026"), modifiedAt: null },
    },
    {
      id: uuidv4(),
      title: "Title no longer overflows",
      body: "My note is the best in the world",
      time: { createdAt: new Date("13 April 2025"), modifiedAt: null },
    },
  ]);
  let displayNotes: Note[] = $state([...notes]);

  let isSidebarClosed: boolean = $state(false);

  let query = $state("");

  let bodyField: HTMLElement | undefined = $state();
  let editorState: { editor: Editor | null } = $state({ editor: null });

  onMount(() => {
    editorState.editor = new Editor({
      element: bodyField,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Body goes here...",
        }),
      ],
      // content: `Hello World`,
      onTransaction: ({ editor }) => {
        editorState = { editor };
      },
    });
  });

  function filterNotes(): void {
    if (!query) {
      displayNotes = [...notes];
      return;
    }

    let queryString = query.trim().toLowerCase();
    displayNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(queryString) ||
        note.body.toLowerCase().includes(queryString),
    );
  }

  function getTimeString(date: Date): string {
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
      <Button
        size="icon-sm"
        variant="outline"
        class="toggle"
        onclick={() => (isSidebarClosed = !isSidebarClosed)}
        title="Toggle sidebar"
      >
        <PanelRight />
      </Button>
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
          oninput={filterNotes}
          placeholder="Search your notes"
        />
      </div>
    </div>

    <div class="notes-list {isSidebarClosed ? 'hidden' : ''}">
      <ul class="flex flex-col gap-4 h-125 overflow-auto">
        {#each displayNotes as note (note.id)}
          <li class="border rounded-md p-2">
            <header class="mb-2">
              <span>
                <small class="text-gray-500">
                  {note.time.modifiedAt
                    ? `Modified: ${getTimeString(note.time.modifiedAt)}`
                    : `Created: ${getTimeString(note.time.createdAt)}`}
                </small>
              </span>
            </header>

            <h2
              class="note-title whitespace-nowrap overflow-hidden text-ellipsis font-bold mb-1"
            >
              {note.title}
            </h2>
            <p class="note-body text-sm">{note.body}</p>
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
    <header class="flex items-center gap-4 mb-12">
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
      <!-- <div class="note-save-status"></div> -->
    </header>

    <div class="editor-fields">
      <div class="title-field mb-12">
        <input
          class="text-xl w-full"
          id="editor-title-input"
          type="text"
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
