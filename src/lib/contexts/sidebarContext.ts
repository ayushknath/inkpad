import { createContext } from "svelte";

export const [getSidebarContext, setSidebarContext] = createContext<{
  isSidebarClosed: boolean;
}>();
