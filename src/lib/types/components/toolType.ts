export interface ToolType {
  name: string;
  canExecute: () => boolean | undefined;
  execute: () => boolean | undefined;
  isActive: () => boolean | undefined;
}
