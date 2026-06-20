import type { Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { issueService } from "../services/issue.service.js";
import type { CreateIssueInput, IssueQuery, UpdateIssueInput } from "../types/issue.js";

export const issueController = {
  async list(req: Request, res: Response) {
    const issues = await issueService.list((req.parsedQuery ?? req.query) as IssueQuery);
    res.json({ success: true, data: issues });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const issue = await issueService.getById(id);
    if (!issue) {
      throw new HttpError(404, "Issue not found");
    }
    res.json({ success: true, data: issue });
  },

  async create(req: Request, res: Response) {
    const issue = await issueService.create(req.body as CreateIssueInput);
    res.status(201).json({ success: true, data: issue });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const issue = await issueService.update(id, req.body as UpdateIssueInput);
    res.json({ success: true, data: issue });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await issueService.remove(id);
    res.json({ success: true, data: { id } });
  },
};
