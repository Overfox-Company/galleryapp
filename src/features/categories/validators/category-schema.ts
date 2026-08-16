import { z } from "zod";
import { CATEGORY_ICON_OPTIONS } from "../constants/category-icons";

const iconNames = CATEGORY_ICON_OPTIONS.map((option) => option.value);

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Escribe al menos 2 caracteres").max(40),
  icon: z.string().refine((value) => iconNames.includes(value as never)),
});
