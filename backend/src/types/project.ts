import { z } from "zod";

const projectStatusValues = ["ACTIVE", "PAUSED", "COMPLETED"] as const;
export const projectStatusSchema = z.enum(projectStatusValues);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: projectStatusSchema.default("ACTIVE"),
});

export const updateProjectSchema = createProjectSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
