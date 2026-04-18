<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Plus } from "@lucide/svelte";
  import { appStore } from "$lib/state/appStore.svelte";
  import { noteService } from "$lib/service/noteService";
</script>

<Button
  class="new-note-btn"
  size="icon-sm"
  variant="outline"
  title="New note"
  onclick={() => {
    if (appStore.state.editor.activeNote) noteService.saveNote();
    appStore.state.editor.activeNote = null;
    noteService.clearEditor();
  }}
>
  <Plus />
</Button>
