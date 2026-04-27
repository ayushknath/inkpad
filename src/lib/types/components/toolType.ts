export interface ToolType {
  name: string;
  title: string;
  canExecute: () => boolean | undefined;
  execute: () => boolean | undefined;
  isActive: () => boolean | undefined;
}
