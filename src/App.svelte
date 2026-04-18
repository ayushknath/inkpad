<script lang="ts">
  import { onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import { Placeholder } from "@tiptap/extensions";
  import Sidebar from "./components/Sidebar/Sidebar.svelte";
  import NoteEditor from "./components/Editor/NoteEditor.svelte";
  import { startTime, stopTime } from "$lib/state/time.svelte";
  import { appStore } from "$lib/state/appStore.svelte";
  import { saveService } from "$lib/service/saveService";

  onMount(() => {
    startTime();

    appStore.state.editor.editorState.editor = new Editor({
      element: appStore.state.editor.bodyField,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Body goes here...",
        }),
      ],
      onTransaction({ editor }) {
        appStore.state.editor.editorState = { editor };
      },
      onUpdate({ editor }) {
        saveService.resetTimer();
      },
    });

    return () => {
      stopTime();
      appStore.state.editor.editorState.editor?.destroy();
    };
  });
</script>

<div
  class="grid {appStore.state.sidebar.isSidebarClosed
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
