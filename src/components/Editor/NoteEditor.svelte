<script lang="ts">
  import Header from "./Header/Header.svelte";
  import TitleEditor from "./TitleEditor.svelte";
  import BodyEditor from "./BodyEditor.svelte";
</script>

<section class="editor py-4 px-8">
  <Header />

  <div class="editor-fields">
    <TitleEditor />
    <BodyEditor />
  </div>
</section>
