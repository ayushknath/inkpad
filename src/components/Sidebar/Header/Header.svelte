<script lang="ts">
  import NewNote from "./NewNote.svelte";
  import Toggle from "./Toggle.svelte";
  import { getSidebarContext } from "$lib/contexts/sidebarContext";

  const sidebarState = getSidebarContext();
</script>

<header
  class="flex items-center {sidebarState.isSidebarClosed
    ? 'justify-center'
    : 'justify-between'} mb-6"
>
  <div class="logo {sidebarState.isSidebarClosed ? 'hidden' : ''}">
    <span class="font-bold">INKPAD</span>
  </div>
  <div
    class="flex {sidebarState.isSidebarClosed
      ? 'flex-col-reverse justify-center'
      : 'items-center'} gap-2"
  >
    <NewNote />

    <Toggle />
  </div>
</header>
