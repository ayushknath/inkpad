<script lang="ts">
  import { getEditorContext } from "$lib/contexts/editorContext";

  const editorStates = getEditorContext();
</script>

<div class="body-field" bind:this={editorStates.bodyField}></div>
