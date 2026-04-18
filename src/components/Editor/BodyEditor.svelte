<script lang="ts">
  import { appStore } from "$lib/state/appStore.svelte";
</script>

<div class="body-field" bind:this={appStore.state.editor.bodyField}></div>
