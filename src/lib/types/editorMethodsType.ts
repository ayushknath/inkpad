export interface editorMethodsType {
  saveNote: () => void;
  editNote: (id: string) => void;
  deleteNote: (id: string) => void;
  clearEditor: () => void;
}
