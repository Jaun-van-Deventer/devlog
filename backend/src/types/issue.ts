import { z } from "zod";

const issueSeverityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const issueStatusValues = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const createIssueSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(2000),
  severity: z.enum(issueSeverityValues),
  status: z.enum(issueStatusValues).default("OPEN"),
  projectId: z.coerce.number().int().positive(),
});

export const updateIssueSchema = createIssueSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const issueQuerySchema = z.object({
  severity: z.enum(issueSeverityValues).optional(),
  status: z.enum(issueStatusValues).optional(),
  projectId: z.coerce.number().int().positive().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type IssueQuery = z.infer<typeof issueQuerySchema>;
