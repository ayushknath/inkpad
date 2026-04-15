<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Search } from "@lucide/svelte";
  import { getNoteContext } from "$lib/contexts/noteContext";
  import { getSidebarContext } from "$lib/contexts/sidebarContext";

  const noteStates = getNoteContext();
  const sidebarState = getSidebarContext();
</script>

<div class="mb-4 {sidebarState.isSidebarClosed ? 'hidden' : ''}">
  <h1 class="font-bold text-2xl mb-2.5">Your notes</h1>
  <div class="relative">
    <div class="absolute top-2 left-2">
      <Search size={20} color="#73737C" />
    </div>
    <Input
      class="pl-8.5"
      type="search"
      bind:value={noteStates.query}
      placeholder="Search your notes"
    />
  </div>
</div>
