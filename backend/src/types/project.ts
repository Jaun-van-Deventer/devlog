import { z } from "zod";
import { ProjectStatus } from "../../generated/prisma/enums.js";

export const projectStatusSchema = z.enum(ProjectStatus);

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
