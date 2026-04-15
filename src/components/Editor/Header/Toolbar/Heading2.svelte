<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Heading2 } from "@lucide/svelte";
  import { getEditorContext } from "$lib/contexts/editorContext";

  const editorStates = getEditorContext();
</script>

<Button
  size="icon"
  variant="outline"
  class={editorStates.editorState.editor?.isActive("heading", { level: 2 })
    ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
    : ""}
  onclick={() =>
    editorStates.editorState.editor
      ?.chain()
      .focus()
      .toggleHeading({ level: 2 })
      .run()}
  disabled={!editorStates.editorState.editor
    ?.can()
    .chain()
    .focus()
    .toggleHeading({ level: 2 })
    .run()}
>
  <Heading2 />
</Button>
