export const CATEGORY_ICON_OPTIONS = [
  { value: "design", label: "Diseño" },
  { value: "mobile", label: "Aplicaciones" },
  { value: "web", label: "Sitios web" },
  { value: "commerce", label: "Comercio" },
  { value: "productivity", label: "Productividad" },
  { value: "code", label: "Desarrollo" },
  { value: "media", label: "Multimedia" },
  { value: "other", label: "Otros" },
] as const;

export type CategoryIconName = (typeof CATEGORY_ICON_OPTIONS)[number]["value"];
