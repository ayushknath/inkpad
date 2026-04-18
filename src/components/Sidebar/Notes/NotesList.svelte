<script lang="ts">
  import NoteItem from "./NoteItem.svelte";
  import { appStore } from "$lib/state/appStore.svelte";
</script>

<div
  class="notes-list {appStore.state.sidebar.isSidebarClosed ? 'hidden' : ''}"
>
  <ul class="flex flex-col gap-4 h-125 overflow-auto">
    {#each appStore.displayNotes as note (note.id)}
      <NoteItem {note} />
    {/each}
  </ul>
</div>
