<script lang="ts">
  import { appStore } from "$lib/state/appStore.svelte";
  import { saveService } from "$lib/service/saveService";
</script>

<div class="title-field mb-12">
  <input
    class="w-full text-2xl font-bold"
    id="editor-title-input"
    type="text"
    bind:value={appStore.state.editor.editorTitle}
    oninput={() => {
      saveService.resetTimer();
    }}
    placeholder="Title goes here..."
  />
</div>

<style>
  #editor-title-input {
    border: 0;
    outline: 0;
  }
</style>
