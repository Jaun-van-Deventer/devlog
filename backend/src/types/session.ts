import { z } from "zod";

export const createSessionSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  date: z.coerce.date(),
  hours: z.coerce.number().positive().max(24),
  notes: z.string().max(1000).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
