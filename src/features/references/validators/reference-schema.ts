import { z } from "zod";

export const referenceInputSchema = z
  .object({
    sessionId: z.string().uuid(),
    name: z.string().trim().min(2).max(80),
    categoryId: z.string().min(1),
    hasWeb: z.boolean(),
    hasMobile: z.boolean(),
  })
  .refine((value) => value.hasWeb || value.hasMobile, {
    message: "Activa al menos una versión web o mobile.",
  });

export type ReferenceInput = z.infer<typeof referenceInputSchema>;
