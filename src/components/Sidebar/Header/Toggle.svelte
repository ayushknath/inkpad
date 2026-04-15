<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { PanelRight } from "@lucide/svelte";
  import { getSidebarContext } from "$lib/contexts/sidebarContext";

  const sidebarState = getSidebarContext();
</script>

<Button
  size="icon-sm"
  variant="outline"
  class="toggle"
  title="Toggle sidebar"
  onclick={() => (sidebarState.isSidebarClosed = !sidebarState.isSidebarClosed)}
>
  <PanelRight />
</Button>
