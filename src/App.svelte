<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { PanelRight, Search } from "@lucide/svelte";

  interface Note {
    id: string;
    title: string;
    body: string;
    time: {
      createdAt: Date;
      modifiedAt: Date | null;
    };
  }

  const notes: Note[] = $state([
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A eligendi iste qui, sequi atque aspernatur necessitatibus, tenetur itaque earum maxime officia quaerat accusantium, enim repudiandae iusto voluptate? Facilis, distinctio quam.",
      time: { createdAt: new Date(), modifiedAt: null },
    },
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A eligendi iste qui, sequi atque aspernatur necessitatibus, tenetur itaque earum maxime officia quaerat accusantium, enim repudiandae iusto voluptate? Facilis, distinctio quam.",
      time: { createdAt: new Date(), modifiedAt: new Date("10 April 2026") },
    },
    {
      id: uuidv4(),
      title: "A very long title which should overflow it's container hopefully",
      body: "Hello World",
      time: { createdAt: new Date("13 April 2026"), modifiedAt: null },
    },
    {
      id: uuidv4(),
      title: "Title no longer overflows",
      body: "My note is the best in the world",
      time: { createdAt: new Date("13 April 2025"), modifiedAt: null },
    },
  ]);
  let displayNotes: Note[] = $state([...notes]);

  let isSidebarClosed: boolean = $state(false);

  let query = $state("");

  function filterNotes(): void {
    if (!query) {
      displayNotes = [...notes];
      return;
    }

    let queryString = query.trim().toLowerCase();
    displayNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(queryString) ||
        note.body.toLowerCase().includes(queryString),
    );
  }

  function getTimeString(date: Date): string {
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

    let duration = (date.getTime() - new Date().getTime()) / 1000;
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

<div class="max-w-384 h-screen mx-auto overflow-hidden 2xl:border-x">
  <section
    class="sidebar relative {isSidebarClosed
      ? 'w-20'
      : 'w-xs'} h-full border-r p-4"
  >
    <header
      class="flex items-center {isSidebarClosed
        ? 'justify-center'
        : 'justify-between'} mb-6"
    >
      <div class="logo {isSidebarClosed ? 'hidden' : ''}">
        <span class="font-bold">INKPAD</span>
      </div>
      <Button
        size="icon-sm"
        variant="outline"
        class="toggle"
        onclick={() => (isSidebarClosed = !isSidebarClosed)}
        title="Toggle sidebar"
      >
        <PanelRight />
      </Button>
    </header>

    <div class="mb-4 {isSidebarClosed ? 'hidden' : ''}">
      <h1 class="font-bold text-2xl mb-2.5">Your notes</h1>
      <div class="relative">
        <div class="absolute top-2 left-2">
          <Search size={20} color="#73737C" />
        </div>
        <Input
          class="pl-8.5"
          type="search"
          bind:value={query}
          oninput={filterNotes}
          placeholder="Search your notes"
        />
      </div>
    </div>

    <div class="notes-list {isSidebarClosed ? 'hidden' : ''}">
      <ul class="flex flex-col gap-4 h-125 overflow-auto">
        {#each displayNotes as note (note.id)}
          <li class="border rounded-md p-2">
            <header class="mb-2">
              <span>
                <small class="text-gray-500">
                  {note.time.modifiedAt
                    ? `Modified: ${getTimeString(note.time.modifiedAt)}`
                    : `Created: ${getTimeString(note.time.createdAt)}`}
                </small>
              </span>
            </header>

            <h2
              class="note-title whitespace-nowrap overflow-hidden text-ellipsis font-bold mb-1"
            >
              {note.title}
            </h2>
            <p class="note-body text-sm">{note.body}</p>
          </li>
        {/each}
      </ul>
    </div>

    <div
      class="user absolute bottom-0 left-0 w-full {isSidebarClosed
        ? 'py-4 px-2'
        : 'p-4'} bg-gray-300"
    >
      <p class={isSidebarClosed ? "text-sm" : ""}>Work in progress</p>
    </div>
  </section>
</div>

<style>
  .note-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
