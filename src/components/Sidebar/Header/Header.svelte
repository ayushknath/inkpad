<script lang="ts">
  import { appStore } from "$lib/state/appStore.svelte";
  import NewNote from "./NewNote.svelte";
  import Toggle from "./Toggle.svelte";
</script>

<header
  class="flex items-center {appStore.state.sidebar.isSidebarClosed
    ? 'justify-center'
    : 'justify-between'} mb-6"
>
  <div class="logo {appStore.state.sidebar.isSidebarClosed ? 'hidden' : ''}">
    <span class="font-bold">INKPAD</span>
  </div>
  <div
    class="flex {appStore.state.sidebar.isSidebarClosed
      ? 'flex-col-reverse justify-center'
      : 'items-center'} gap-2"
  >
    <NewNote />

    <Toggle />
  </div>
</header>
