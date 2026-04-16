<script lang="ts">
  import { getEditorContext } from "$lib/contexts/editorContext";
  import type { ToolType } from "$lib/types/components/toolType";
  import Tool from "./Tool.svelte";

  const editorStates = getEditorContext();

  const tools: ToolType[] = [
    {
      name: "bold",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleBold()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleBold()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("bold");
      },
    },
    {
      name: "italic",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleItalic()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleItalic()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("italic");
      },
    },
    {
      name: "underline",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleUnderline()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleUnderline()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("underline");
      },
    },
    {
      name: "strike",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleStrike()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleStrike()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("strike");
      },
    },
    {
      name: "bulletList",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleBulletList()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleBulletList()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("bulletList");
      },
    },
    {
      name: "orderedList",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleOrderedList()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleOrderedList()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("orderedList");
      },
    },
    {
      name: "heading1",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleHeading({ level: 1 })
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleHeading({ level: 1 })
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("heading", {
          level: 1,
        });
      },
    },
    {
      name: "heading2",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleHeading({ level: 2 })
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleHeading({ level: 2 })
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("heading", {
          level: 2,
        });
      },
    },
    {
      name: "codeBlock",
      canExecute() {
        return editorStates.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleCodeBlock()
          .run();
      },
      execute() {
        return editorStates.editorState.editor
          ?.chain()
          .focus()
          .toggleCodeBlock()
          .run();
      },
      isActive() {
        return editorStates.editorState.editor?.isActive("codeBlock");
      },
    },
  ];
</script>

<div class="toolbar">
  <ul class="flex items-center gap-2">
    {#each tools as tool}
      <li>
        <Tool {tool} />
      </li>
    {/each}
  </ul>
</div>
