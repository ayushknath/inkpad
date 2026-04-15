<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Strikethrough } from "@lucide/svelte";
  import { getEditorContext } from "$lib/contexts/editorContext";

  const editorStates = getEditorContext();
</script>

<Button
  size="icon"
  variant="outline"
  class={editorStates.editorState.editor?.isActive("strike")
    ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
    : ""}
  onclick={() =>
    editorStates.editorState.editor?.chain().focus().toggleStrike().run()}
  disabled={!editorStates.editorState.editor
    ?.can()
    .chain()
    .focus()
    .toggleStrike()
    .run()}
>
  <Strikethrough />
</Button>
