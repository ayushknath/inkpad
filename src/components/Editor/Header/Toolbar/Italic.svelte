<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Italic } from "@lucide/svelte";
  import { getEditorContext } from "$lib/contexts/editorContext";

  const editorStates = getEditorContext();
</script>

<Button
  size="icon"
  variant="outline"
  class={editorStates.editorState.editor?.isActive("italic")
    ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
    : ""}
  onclick={() =>
    editorStates.editorState.editor?.chain().focus().toggleItalic().run()}
  disabled={!editorStates.editorState.editor
    ?.can()
    .chain()
    .focus()
    .toggleItalic()
    .run()}
>
  <Italic />
</Button>
