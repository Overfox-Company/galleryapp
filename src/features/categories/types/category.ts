export type CategoryRecord = {
  id: string;
  name: string;
  icon: string;
  referenceCount: number;
};

export type CategoryOption = Pick<CategoryRecord, "id" | "name" | "icon">;
