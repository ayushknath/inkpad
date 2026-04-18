<script lang="ts">
  import { CloudUpload, CloudCheck, CloudAlert, Cloud } from "@lucide/svelte";
  import { appStore } from "$lib/state/appStore.svelte";
</script>

<div class="note-save-status">
  {#if appStore.state.editor.activeNote}
    <div
      title={appStore.state.noteSave.status
        ? appStore.state.noteSave.status
        : ""}
    >
      {#if appStore.state.noteSave.status === "saving"}
        <CloudUpload size={20} />
      {:else if appStore.state.noteSave.status === "saved"}
        <CloudCheck size={20} />
      {:else if appStore.state.noteSave.status === "error"}
        <CloudAlert size={20} />
      {:else}
        <Cloud size={20} />
      {/if}
    </div>
  {/if}
</div>
