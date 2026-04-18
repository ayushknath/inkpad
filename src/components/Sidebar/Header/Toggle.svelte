<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { appStore } from "$lib/state/appStore.svelte";
  import { PanelRight } from "@lucide/svelte";
</script>

<Button
  size="icon-sm"
  variant="outline"
  class="toggle"
  title="Toggle sidebar"
  onclick={() =>
    (appStore.state.sidebar.isSidebarClosed =
      !appStore.state.sidebar.isSidebarClosed)}
>
  <PanelRight />
</Button>
