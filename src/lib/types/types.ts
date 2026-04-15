export interface Note {
  id: string;
  title: string;
  body: any; // TODO: deal later with the type
  lastChange: {
    title: string;
    body: any; // TODO: deal with type later
  };
  time: {
    createdAt: Date;
    modifiedAt: Date | null;
  };
}

export interface saveStatusType {
  status: "saving" | "saved" | "error" | null;
}
