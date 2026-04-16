<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
    Underline,
  } from "@lucide/svelte";
  import type { ToolType } from "$lib/types/components/toolType";

  const { tool }: { tool: ToolType } = $props();
</script>

<Button
  size="icon"
  variant="outline"
  class={tool.isActive()
    ? "bg-gray-800 text-white outline-transparent hover:bg-gray-600 hover:text-white hover:outline-transparent"
    : ""}
  onclick={() => tool.execute()}
  disabled={!tool.canExecute()}
>
  {#if tool.name === "bold"}
    <Bold />
  {:else if tool.name === "italic"}
    <Italic />
  {:else if tool.name === "underline"}
    <Underline />
  {:else if tool.name === "strike"}
    <Strikethrough />
  {:else if tool.name === "bulletList"}
    <List />
  {:else if tool.name === "orderedList"}
    <ListOrdered />
  {:else if tool.name === "heading1"}
    <Heading1 />
  {:else if tool.name === "heading2"}
    <Heading2 />
  {:else if tool.name === "codeBlock"}
    <Code />
  {/if}
</Button>
