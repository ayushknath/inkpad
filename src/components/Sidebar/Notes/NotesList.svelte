<script lang="ts">
  import NoteItem from "./NoteItem.svelte";
  import { getNoteContext } from "$lib/contexts/noteContext";
  import { getSidebarContext } from "$lib/contexts/sidebarContext";

  const noteStates = getNoteContext();
  const sidebarState = getSidebarContext();
</script>

<div class="notes-list {sidebarState.isSidebarClosed ? 'hidden' : ''}">
  <ul class="flex flex-col gap-4 h-125 overflow-auto">
    {#each noteStates.displayNotes as note (note.id)}
      <NoteItem {note} />
    {/each}
  </ul>
</div>
