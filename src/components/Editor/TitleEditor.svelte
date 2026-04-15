<script lang="ts">
  import { getEditorContext } from "$lib/contexts/editorContext";
  import { getDebounceSaveContext } from "$lib/contexts/debounceSaveContext";

  const editorStates = getEditorContext();
  const { clearDebounceSaveTimer, startDebounceSaveTimer } =
    getDebounceSaveContext();
</script>

<div class="title-field mb-12">
  <input
    class="text-xl w-full"
    id="editor-title-input"
    type="text"
    bind:value={editorStates.editorTitle}
    oninput={() => {
      clearDebounceSaveTimer();
      startDebounceSaveTimer();
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
