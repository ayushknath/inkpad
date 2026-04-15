<script lang="ts">
  import Header from "./Header/Header.svelte";
  import Searchbar from "./Searchbar.svelte";
  import NotesList from "./Notes/NotesList.svelte";
  import { getSidebarContext } from "$lib/contexts/sidebarContext";

  const sidebarState = getSidebarContext();
</script>

<section class="sidebar relative h-full border-r p-4">
  <Header />

  <Searchbar />

  <NotesList />

  <div
    class="user absolute bottom-0 left-0 w-full {sidebarState.isSidebarClosed
      ? 'py-4 px-2'
      : 'p-4'} bg-gray-300"
  >
    <p class={sidebarState.isSidebarClosed ? "text-sm" : ""}>
      Work in progress
    </p>
  </div>
</section>
