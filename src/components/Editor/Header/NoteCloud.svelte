<script lang="ts">
  import { CloudUpload, CloudCheck, CloudAlert, Cloud } from "@lucide/svelte";
  import { getEditorContext } from "$lib/contexts/editorContext";
  import { getSaveStatusContext } from "$lib/contexts/saveStatusContext";

  const editorStates = getEditorContext();
  const saveStatus = getSaveStatusContext();
</script>

<div class="note-save-status">
  {#if editorStates.activeNote}
    <div title={saveStatus.status ? saveStatus.status : ""}>
      {#if saveStatus.status === "saving"}
        <CloudUpload size={20} />
      {:else if saveStatus.status === "saved"}
        <CloudCheck size={20} />
      {:else if saveStatus.status === "error"}
        <CloudAlert size={20} />
      {:else}
        <Cloud size={20} />
      {/if}
    </div>
  {/if}
</div>
