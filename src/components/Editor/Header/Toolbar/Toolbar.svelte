<script lang="ts">
  import Bold from "./Bold.svelte";
  import Italic from "./Italic.svelte";
  import Underline from "./Underline.svelte";
  import Strike from "./Strike.svelte";
  import BulletList from "./BulletList.svelte";
  import OrderedList from "./OrderedList.svelte";
  import Heading1 from "./Heading1.svelte";
  import Heading2 from "./Heading2.svelte";
  import Code from "./Code.svelte";
</script>

<div class="toolbar">
  <ul class="flex items-center gap-2">
    <li>
      <Bold />
    </li>
    <li>
      <Italic />
    </li>
    <li>
      <Underline />
    </li>
    <li>
      <Strike />
    </li>
    <li>
      <BulletList />
    </li>
    <li>
      <OrderedList />
    </li>
    <li>
      <Heading1 />
    </li>
    <li>
      <Heading2 />
    </li>
    <li>
      <Code />
    </li>
  </ul>
</div>
