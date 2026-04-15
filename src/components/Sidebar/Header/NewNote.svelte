<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Plus } from "@lucide/svelte";
  import { getEditorContext } from "$lib/contexts/editorContext";
  import { getEditorMethodsContext } from "$lib/contexts/editorMethodsContext";

  const editorStates = getEditorContext();
  const { saveNote, clearEditor } = getEditorMethodsContext();
</script>

<Button
  class="new-note-btn"
  size="icon-sm"
  variant="outline"
  title="New note"
  onclick={() => {
    if (editorStates.activeNote) saveNote();
    editorStates.activeNote = null;
    clearEditor();
  }}
>
  <Plus />
</Button>
