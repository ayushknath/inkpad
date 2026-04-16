<script lang="ts">
  import type { Note } from "$lib/types/types";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Ellipsis, Pencil, Trash } from "@lucide/svelte";
  import { getEditorMethodsContext } from "$lib/contexts/editorMethodsContext";
  import { onMount } from "svelte";

  const { editNote, deleteNote } = getEditorMethodsContext();

  let { note }: { note: Note } = $props();

  let now = $state(Date.now());

  onMount(() => {
    const interval = setInterval(() => {
      now = Date.now();
    }, 60000);

    return () => clearInterval(interval);
  });

  function getTimeString(date: Date | string, now: number): string {
    date = new Date(date);

    const rtf = new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
      style: "short",
    });

    const DIVISIONS = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.345, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];
    const LEN_DIVISIONS = DIVISIONS.length;

    let duration = (date.getTime() - now) / 1000;
    let timeString = "";

    for (let i = 0; i < LEN_DIVISIONS; i++) {
      const d = DIVISIONS[i];
      if (Math.abs(duration) < d.amount) {
        timeString = rtf.format(
          Math.round(duration),
          d.name as Intl.RelativeTimeFormatUnit,
        );
        break;
      }
      duration /= d.amount;
    }

    return timeString;
  }
</script>

<li class="border rounded-md p-2">
  <header class="flex items-center justify-between mb-2">
    <span>
      <small class="text-gray-500">
        {note.time.modifiedAt
          ? `Modified: ${getTimeString(note.time.modifiedAt, now)}`
          : `Created: ${getTimeString(note.time.createdAt, now)}`}
      </small>
    </span>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="icon-sm" variant="outline" title="More options">
          <Ellipsis />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-auto">
        <DropdownMenu.Group>
          <DropdownMenu.Item onSelect={() => editNote(note.id)}>
            <Pencil /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => deleteNote(note.id)}>
            <Trash /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </header>

  <h2
    class="note-title whitespace-nowrap overflow-hidden text-ellipsis font-bold mb-1"
  >
    {note.title}
  </h2>
  <p class="note-body text-sm">
    {#each note.body.content[0].content as c}
      <span>{c.text}</span>
    {/each}
  </p>
</li>

<style>
  .note-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
