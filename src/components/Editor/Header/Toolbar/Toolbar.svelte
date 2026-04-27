<script lang="ts">
  import { appStore } from "$lib/state/appStore.svelte";
  import type { ToolType } from "$lib/types/components/toolType";
  import Tool from "./Tool.svelte";

  const tools: ToolType[] = [
    {
      name: "bold",
      title: "Bold",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleBold()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleBold()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("bold");
      },
    },
    {
      name: "italic",
      title: "Italic",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleItalic()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleItalic()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("italic");
      },
    },
    {
      name: "underline",
      title: "Underline",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleUnderline()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleUnderline()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("underline");
      },
    },
    {
      name: "strike",
      title: "Strike",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleStrike()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleStrike()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("strike");
      },
    },
    {
      name: "bulletList",
      title: "Bullet List",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleBulletList()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleBulletList()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("bulletList");
      },
    },
    {
      name: "orderedList",
      title: "Ordered List",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleOrderedList()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleOrderedList()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive(
          "orderedList",
        );
      },
    },
    {
      name: "taskList",
      title: "Task List",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleTaskList()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleTaskList()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("taskList");
      },
    },
    {
      name: "heading1",
      title: "Heading 1",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleHeading({ level: 1 })
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleHeading({ level: 1 })
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("heading", {
          level: 1,
        });
      },
    },
    {
      name: "heading2",
      title: "Heading 2",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleHeading({ level: 2 })
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleHeading({ level: 2 })
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("heading", {
          level: 2,
        });
      },
    },
    {
      name: "codeBlock",
      title: "Code Block",
      canExecute() {
        return appStore.state.editor.editorState.editor
          ?.can()
          .chain()
          .focus()
          .toggleCodeBlock()
          .run();
      },
      execute() {
        return appStore.state.editor.editorState.editor
          ?.chain()
          .focus()
          .toggleCodeBlock()
          .run();
      },
      isActive() {
        return appStore.state.editor.editorState.editor?.isActive("codeBlock");
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
